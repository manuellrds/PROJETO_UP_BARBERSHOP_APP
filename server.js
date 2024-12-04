const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database');
//const { getBarbeiros, getBarbeirosByName } = require('./database');


const swaggerJsDoc = require('./swagger'); // Importa o Swagger
const adminRoutes = require('./routes/adminRoutes'); // Importa as rotas de administração

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerJsDoc.swaggerUi.serve, swaggerJsDoc.swaggerUi.setup(swaggerJsDoc.swaggerSpec)); // Adiciona a rota do Swagger

const { buscarAgendamentosCompletos } = require('./database');

app.get('/agendamentos/completos', async (req, res) => {
    try {
        const agendamentos = await buscarAgendamentosCompletos();
        if (agendamentos.length === 0) {
            return res.status(404).json({ message: 'Nenhum agendamento encontrado.' });
        }
        res.json(agendamentos);
    } catch (error) {
        console.error('Erro ao buscar agendamentos completos:', error);
        res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
    }
});

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastra um novo usuário
 *     description: Adiciona um novo usuário ao sistema. É necessário fornecer nome, email e senha. Um papel (role) pode ser especificado, mas será 'user' por padrão.
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: joao.silva@example.com
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: senha123
 *               role:
 *                 type: string
 *                 description: Papel do usuário no sistema
 *                 example: admin
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário cadastrado com sucesso!
 *       400:
 *         description: Dados obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nome, email e senha são obrigatórios!
 *       409:
 *         description: Email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email já cadastrado
 *       500:
 *         description: Erro interno ao cadastrar usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao cadastrar usuário
 */
app.post('/usuarios', async (req, res) => {
  const { nome, email, senha, role } = req.body; 
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios!' });
  }
  try {
    const existingUser = await db.buscarUsuarioPorEmail(email);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);
    await db.inserirUsuario(nome, email, senhaCriptografada, role || 'user');
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
});


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login de um usuário
 *     description: Autentica um usuário no sistema utilizando email e senha. Retorna informações do usuário e se ele é administrador.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: joao.silva@example.com
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login bem-sucedido
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID do usuário
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       description: Nome do usuário
 *                       example: João Silva
 *                     email:
 *                       type: string
 *                       description: Email do usuário
 *                       example: joao.silva@example.com
 *                     isAdmin:
 *                       type: boolean
 *                       description: Indica se o usuário é administrador
 *                       example: true
 *       400:
 *         description: Dados obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email e senha são obrigatórios!
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário não encontrado
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credenciais inválidas
 *       500:
 *         description: Erro interno ao realizar login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao realizar login
 */
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
  }
  try {
    const usuarios = await db.buscarUsuarioPorEmail(email);
    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    const senhaCorreta = await bcrypt.compare(senha, usuarios[0].senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const isAdmin = usuarios[0].role === 'admin'; 
    return res.status(200).json({ 
      message: 'Login bem-sucedido', 
      usuario: {
        id: usuarios[0].id,
        nome: usuarios[0].nome,
        email: usuarios[0].email,
        isAdmin,
      }
    });
  } catch (err) {
    console.error('Erro ao realizar login:', err);
    return res.status(500).json({ message: 'Erro ao realizar login' });
  }
});


/**
 * @swagger
 * /cortes:
 *   get:
 *     summary: Busca cortes
 *     description: Retorna uma lista de cortes. Se fornecido o parâmetro `nome`, retorna apenas os cortes correspondentes ao nome especificado.
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *           example: "Degradê"
 *         description: Nome do corte para filtrar os resultados.
 *     responses:
 *       200:
 *         description: Lista de cortes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do corte.
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     description: Nome do corte.
 *                     example: "Degradê"
 *                   descricao:
 *                     type: string
 *                     description: Descrição do corte.
 *                     example: "Corte com laterais degradê e topo alongado"
 *                   preco:
 *                     type: number
 *                     description: Preço do corte.
 *                     example: 25.0
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar cortes."
 */
app.get('/cortes', async (req, res) => {
  try {
    const { nome } = req.query; // Captura o parâmetro `nome` da query string

    if (nome) {
      // Busca cortes filtrados pelo nome
      const cortes = await db.getCortesByName(nome);
      res.json(cortes);
    } else {
      // Busca todos os cortes
      const cortes = await db.getCortes();
      res.json(cortes);
    }
  } catch (error) {
    console.error('Erro ao buscar cortes:', error);
    res.status(500).json({ error: error.message });
  }
});


/**
 * @swagger
 * /cortes:
 *   post:
 *     summary: Adiciona um novo corte
 *     description: Cadastra um novo corte no sistema.
 *     tags: [Cortes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do corte
 *                 example: Corte degrade
 *               preco:
 *                 type: number
 *                 description: Preço do corte
 *                 example: 50.00
 *     responses:
 *       201:
 *         description: Corte adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 preco:
 *                   type: number
 *       500:
 *         description: Erro ao adicionar corte
 */
app.post('/cortes', async (req, res) => {
  try {
    const { nome, preco } = req.body;
    const result = await db.inserirCorte(nome, preco);
    res.status(201).json({ id: result.insertId, nome, preco });
  } catch (error) {
    console.error('Erro ao adicionar corte:', error);
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /cortes/{id}:
 *   put:
 *     summary: Atualiza um corte
 *     description: Atualiza os dados de um corte existente no sistema.
 *     tags: [Cortes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do corte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do corte
 *                 example: Corte moderno
 *               preco:
 *                 type: number
 *                 description: Preço do corte
 *                 example: 60.00
 *     responses:
 *       200:
 *         description: Corte atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 preco:
 *                   type: number
 *       500:
 *         description: Erro ao atualizar corte
 */
app.put('/cortes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco } = req.body;
    await db.atualizarCorte(id, nome, preco);
    res.json({ id, nome, preco });
  } catch (error) {
    console.error('Erro ao atualizar corte:', error);
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /agendamentos/{id}:
 *   delete:
 *     summary: Exclui um agendamento
 *     description: Remove um agendamento do sistema pelo ID.
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Agendamento excluído com sucesso!
 *       500:
 *         description: Erro ao excluir agendamento
 */
app.delete('/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.excluirAgendamento(id);
    res.status(200).json({ message: 'Agendamento excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir agendamento' });
  }
});

/**
 * @swagger
 * /barbeiros:
 *   get:
 *     summary: Retorna a lista de barbeiros.
 *     description: Obtém todos os barbeiros ou filtra por nome usando um parâmetro de consulta.
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         required: false
 *         description: Nome do barbeiro para filtrar os resultados (parcial ou completo).
 *     responses:
 *       200:
 *         description: Lista de barbeiros.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do barbeiro.
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     description: Nome do barbeiro.
 *                     example: João
 *                   especialidade:
 *                     type: string
 *                     description: Especialidade do barbeiro.
 *                     example: Cortes masculinos
 *       500:
 *         description: Erro interno ao buscar barbeiros.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro.
 *                   example: Erro ao buscar barbeiros.
 */
app.get('/barbeiros', async (req, res) => {
  try {
    const { nome } = req.query;

    if (nome) {
      const barbeiros = await db.getBarbeirosByName(nome);
      res.json(barbeiros);
    } else {
      const barbeiros = await db.getBarbeiros();
      res.json(barbeiros);
    }
  } catch (error) {
    console.error('Erro ao buscar barbeiros:', error);
    res.status(500).json({ error: error.message });
  }
});


/**
 * @swagger
 * /barbeiros:
 *   post:
 *     summary: Adiciona um novo barbeiro
 *     description: Cadastra um novo barbeiro no sistema.
 *     tags: [Barbeiros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do barbeiro
 *                 example: João Barbeiro
 *               especialidade:
 *                 type: string
 *                 description: Especialidade do barbeiro
 *                 example: Cortes modernos
 *     responses:
 *       201:
 *         description: Barbeiro adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 especialidade:
 *                   type: string
 *       500:
 *         description: Erro ao adicionar barbeiro
 */
app.post('/barbeiros', async (req, res) => {
  try {
    const { nome, especialidade } = req.body;
    const result = await db.inserirBarbeiro(nome, especialidade);
    res.status(201).json({ id: result.insertId, nome, especialidade });
  } catch (error) {
    console.error('Erro ao adicionar barbeiro:', error);
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /barbeiros/{id}:
 *   put:
 *     summary: Atualiza os dados de um barbeiro
 *     description: Atualiza as informações de um barbeiro pelo ID.
 *     tags: [Barbeiros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do barbeiro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do barbeiro
 *                 example: João Atualizado
 *               especialidade:
 *                 type: string
 *                 description: Especialidade do barbeiro
 *                 example: Cortes clássicos
 *     responses:
 *       200:
 *         description: Barbeiro atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar barbeiro
 */
app.put('/barbeiros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, especialidade } = req.body;
    await db.atualizarBarbeiro(id, nome, especialidade);
    res.json({ id, nome, especialidade });
  } catch (error) {
    console.error('Erro ao atualizar barbeiro:', error);
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /barbeiros/{id}:
 *   delete:
 *     summary: Remove um barbeiro
 *     description: Exclui um barbeiro pelo ID.
 *     tags: [Barbeiros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do barbeiro
 *     responses:
 *       200:
 *         description: Barbeiro excluído com sucesso
 *       500:
 *         description: Erro ao excluir barbeiro
 */
app.delete('/barbeiros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.excluirBarbeiro(id);
    res.json({ message: 'Barbeiro excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir barbeiro:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /horarios:
 *   get:
 *     summary: Busca horários
 *     description: Retorna uma lista de horários. Se fornecido o parâmetro `data`, retorna apenas os horários da data especificada.
 *     parameters:
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-12-03
 *         description: Data no formato YYYY-MM-DD para filtrar os horários.
 *     responses:
 *       200:
 *         description: Lista de horários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do horário.
 *                     example: 1
 *                   data:
 *                     type: string
 *                     format: date
 *                     description: Data do horário.
 *                     example: 2024-12-03
 *                   hora:
 *                     type: string
 *                     description: Hora do horário.
 *                     example: "14:00"
 *                   disponivel:
 *                     type: boolean
 *                     description: Indica se o horário está disponível.
 *                     example: true
 *       400:
 *         description: Formato de data inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Formato de data inválido. Use YYYY-MM-DD.
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao buscar horários.
 */
app.get('/horarios', async (req, res) => {
  try {
    const { data } = req.query; // Captura o parâmetro `data` da query string

    if (data) {
      // Busca horários filtrados pela data
      const horarios = await db.getHorariosByDate(data);
      res.json(horarios);
    } else {
      // Busca todos os horários
      const horarios = await db.getHorarios();
      res.json(horarios);
    }
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /horarios:
 *   post:
 *     summary: Adiciona um novo horário
 *     description: Cadastra um novo horário no sistema.
 *     tags: [Horários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hora:
 *                 type: string
 *                 description: Horário
 *                 example: "09:00"
 *               disponivel:
 *                 type: boolean
 *                 description: Disponibilidade do horário
 *                 example: true
 *     responses:
 *       201:
 *         description: Horário adicionado com sucesso
 *       500:
 *         description: Erro ao adicionar horário
 */
app.post('/horarios', async (req, res) => {
  try {
    const { hora, disponivel } = req.body;
    const result = await db.inserirHorario(hora, disponivel);
    res.status(201).json({ id: result.insertId, hora, disponivel });
  } catch (error) {
    console.error('Erro ao adicionar horário:', error);
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /horarios/{id}:
 *   put:
 *     summary: Atualiza os dados de um horário
 *     description: Atualiza as informações de um horário pelo ID.
 *     tags: [Horários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do horário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hora:
 *                 type: string
 *                 description: Horário
 *                 example: "10:00"
 *               disponivel:
 *                 type: boolean
 *                 description: Disponibilidade do horário
 *                 example: false
 *     responses:
 *       200:
 *         description: Horário atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar horário
 */
app.put('/horarios/:id', async (req, res) => {
  const { id } = req.params;
  const { hora, disponivel } = req.body;
  try {
    const result = await db.atualizarHorario(id, { hora, disponivel });
    res.status(200).json({ message: 'Horário atualizado com sucesso!', result });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar horário' });
  }
});
/**
 * @swagger
 * /horarios/{id}:
 *   delete:
 *     summary: Exclui um horário
 *     description: Remove um horário cadastrado pelo ID.
 *     tags: [Horários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do horário
 *     responses:
 *       200:
 *         description: Horário excluído com sucesso
 *       500:
 *         description: Erro ao excluir horário
 */
app.delete('/horarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.excluirHorario(id);
    res.json({ message: 'Horário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir horário:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /agendamentos:
 *   post:
 *     summary: Cria um novo agendamento
 *     description: Registra um novo agendamento no sistema.
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               corte:
 *                 type: string
 *                 description: Nome do corte
 *                 example: Corte clássico
 *               barbeiro_id:
 *                 type: integer
 *                 description: ID do barbeiro responsável
 *                 example: 2
 *               horario_id:
 *                 type: integer
 *                 description: ID do horário
 *                 example: 5
 *               usuario_id:
 *                 type: integer
 *                 description: ID do usuário que agendou
 *                 example: 1
 *               cliente:
 *                 type: string
 *                 description: Nome do cliente
 *                 example: João Silva
 *               data:
 *                 type: string
 *                 format: date
 *                 description: Data do agendamento
 *                 example: "2024-12-10"
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *       500:
 *         description: Erro ao salvar agendamento
 */
app.post('/agendamentos', async (req, res) => {
  const { corte, barbeiro_id, horario_id, usuario_id, cliente, data } = req.body;
  if (!corte || !barbeiro_id || !horario_id || !usuario_id || !cliente || !data) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  try {
    const result = await db.inserirAgendamento(corte, barbeiro_id, horario_id, usuario_id, cliente, data);
    res.status(201).json({ message: 'Agendamento realizado com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error);
    res.status(500).json({ error: 'Erro ao salvar agendamento' });
  }
});
/**
 * @swagger
 * /agendamentos:
 *   get:
 *     summary: Lista todos os agendamentos
 *     description: Retorna todos os agendamentos completos registrados no sistema.
 *     tags: [Agendamentos]
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   corte:
 *                     type: string
 *                   barbeiro:
 *                     type: string
 *                   horario:
 *                     type: string
 *                   cliente:
 *                     type: string
 *                   data:
 *                     type: string
 *                     format: date
 *       500:
 *         description: Erro ao buscar agendamentos
 */
app.get('/agendamentos', async (req, res) => {
  try {
    const agendamentos = await db.buscarAgendamentosCompletos();
    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ message: 'Erro ao buscar agendamentos' });
  }
});
/**
 * @swagger
 * /agendamentos/{id}:
 *   put:
 *     summary: Atualiza um agendamento
 *     description: Modifica os dados de um agendamento específico pelo ID.
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               corte:
 *                 type: string
 *                 description: Nome do corte
 *                 example: Corte moderno
 *               barbeiro_id:
 *                 type: integer
 *                 description: ID do barbeiro responsável
 *                 example: 3
 *               horario_id:
 *                 type: integer
 *                 description: ID do horário
 *                 example: 6
 *               cliente:
 *                 type: string
 *                 description: Nome do cliente
 *                 example: Maria Oliveira
 *               data:
 *                 type: string
 *                 format: date
 *                 description: Data do agendamento
 *                 example: "2024-12-15"
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *       500:
 *         description: Erro ao atualizar agendamento
 */
app.put('/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { corte, barbeiro_id, horario_id, cliente, data } = req.body;

  console.log('Recebendo dados para atualização:', { id, corte, barbeiro_id, horario_id, cliente, data });

  if (!corte || !barbeiro_id || !horario_id || !cliente || !data) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    await db.atualizarAgendamento(id, corte, barbeiro_id, horario_id, cliente, data);
    res.status(200).json({ message: 'Agendamento atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
});
/**
 * @swagger
 * /agendamentos/{id}:
 *   delete:
 *     summary: Exclui um agendamento
 *     description: Remove um agendamento específico pelo ID.
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento excluído com sucesso
 *       500:
 *         description: Erro ao excluir agendamento
 */
app.delete('/agendamentos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.excluirAgendamento(id);
    res.status(200).json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).json({ error: 'Erro ao excluir agendamento' });
  }
});

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Cria um feedback
 *     description: Registra um novo feedback no sistema.
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mensagem:
 *                 type: string
 *                 description: Mensagem do feedback
 *                 example: "Ótimo serviço!"
 *     responses:
 *       201:
 *         description: Feedback enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Mensagem do feedback ausente
 *       500:
 *         description: Erro ao enviar feedback
 */
app.post('/feedback', async (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ error: 'A mensagem é obrigatória' });
  }

  try {
    await db.criarFeedback(mensagem);
    res.status(201).json({ message: 'Feedback enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    res.status(500).json({ error: 'Erro ao enviar feedback' });
  }
});

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Lista todos os feedbacks
 *     description: Retorna uma lista de todos os feedbacks enviados.
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: Lista de feedbacks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do feedback
 *                     example: 1
 *                   mensagem:
 *                     type: string
 *                     description: Mensagem do feedback
 *                     example: "Serviço excelente!"
 *       500:
 *         description: Erro ao listar feedbacks
 */
app.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await db.listarFeedbacks();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Erro ao listar feedbacks:', error);
    res.status(500).json({ error: 'Erro ao listar feedbacks' });
  }
});
/**
 * @swagger
 * /feedback/{id}:
 *   put:
 *     summary: Atualiza um feedback
 *     description: Modifica a mensagem de um feedback pelo ID.
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do feedback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mensagem:
 *                 type: string
 *                 description: Mensagem do feedback
 *                 example: "Ótimo atendimento!"
 *     responses:
 *       200:
 *         description: Feedback atualizado com sucesso
 *       400:
 *         description: Mensagem do feedback ausente
 *       500:
 *         description: Erro ao atualizar feedback
 */
app.put('/feedback/:id', async (req, res) => {
  const { id } = req.params;
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ message: 'A mensagem é obrigatória' });
  }

  try {
    await db.atualizarFeedback(id, mensagem); // Certifique-se de que db.atualizarFeedback está correto
    res.status(200).json({ message: 'Feedback atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar feedback:', error);
    res.status(500).json({ message: 'Erro ao atualizar feedback', error });
  }
});

/**
 * @swagger
 * /feedback/{id}:
 *   delete:
 *     summary: Exclui um feedback
 *     description: Remove um feedback cadastrado pelo ID.
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do feedback
 *     responses:
 *       200:
 *         description: Feedback excluído com sucesso
 *       500:
 *         description: Erro ao excluir feedback
 */
app.delete('/feedback/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.excluirFeedback(id);
    res.status(200).json({ message: 'Feedback excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir feedback:', error);
    res.status(500).json({ error: 'Erro ao excluir feedback' });
  }
});

// Endpoint para obter o ID do usuário
/**
 * @swagger
 * /usuario:
 *   get:
 *     summary: Obtém o usuário
 *     description: Retorna as informações do usuário.
 *     tags: [Usuário]
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   description: Nome do usuário
 *                   example: "João Silva"
 *       500:
 *         description: Erro ao obter usuário
 */
app.get('/usuario', async (req, res) => {
  try {
    const usuario = await db.getUsuario(); // Supondo que você tenha uma função para buscar o usuário no banco de dados
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ error: 'Erro ao obter usuário' });
  }
});

/**
 * @swagger
 * /agendamentos/porHorario/{horarioId}:
 *   delete:
 *     summary: Exclui agendamentos por horário
 *     description: Remove todos os agendamentos vinculados ao horário especificado.
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: horarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do horário
 *     responses:
 *       200:
 *         description: Agendamentos excluídos com sucesso
 *       500:
 *         description: Erro ao excluir agendamentos
 */
app.delete('/agendamentos/porHorario/:horarioId', async (req, res) => {
  const { horarioId } = req.params;
  try {
    await db.query('DELETE FROM agendamentos WHERE horario_id = ?', [horarioId]);
    res.status(200).send({ message: 'Agendamentos excluídos com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir agendamentos:', error);
    res.status(500).send({ message: 'Erro ao excluir agendamentos', error });
  }
});

// Adicionando a importação das funções corretas do database.js
const { inserirPreco, getPrecos, atualizarPreco, excluirPreco } = require('./database');

// ... (outras rotas e middleware)

/**
 * @swagger
 * /precos:
 *   get:
 *     summary: Busca preços
 *     description: Retorna uma lista de preços. Se fornecido o parâmetro `nome`, retorna apenas os preços correspondentes ao nome especificado.
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *           example: "Degradê"
 *         description: Nome para filtrar os preços.
 *     responses:
 *       200:
 *         description: Lista de preços.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do preço.
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     description: Nome do item.
 *                     example: "Degradê"
 *                   preco:
 *                     type: number
 *                     description: Preço do item.
 *                     example: 25.0
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar preços."
 */
app.get('/precos', async (req, res) => {
  try {
    const { nome } = req.query; 

    if (nome) {
      
      const precos = await db.getPrecosByName(nome);
      res.json(precos);
    } else {
     
      const precos = await db.getPrecos();
      res.json(precos);
    }
  } catch (error) {
    console.error('Erro ao buscar preços:', error);
    res.status(500).send({ error: 'Erro ao buscar preços' });
  }
});

/**
 * @swagger
 * /precos:
 *   post:
 *     summary: Adiciona um preço
 *     description: Registra um novo preço no sistema.
 *     tags: [Preços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do item
 *                 example: "Corte Completo"
 *               valor:
 *                 type: number
 *                 description: Valor do item
 *                 example: 50.00
 *     responses:
 *       201:
 *         description: Preço adicionado com sucesso
 *       500:
 *         description: Erro ao adicionar preço
 */
app.post('/precos', async (req, res) => {
  try {
    const { nome, valor } = req.body;
    const result = await inserirPreco(nome, valor);
    res.status(201).send(result);
  } catch (error) {
    console.error('Erro ao adicionar preço:', error);
    res.status(500).send({ error: 'Erro ao adicionar preço' });
  }
});
/**
 * @swagger
 * /precos/{id}:
 *   put:
 *     summary: Atualiza um preço
 *     description: Modifica os detalhes de um preço existente.
 *     tags: [Preços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do preço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do item
 *                 example: "Corte Premium"
 *               valor:
 *                 type: number
 *                 description: Valor do item
 *                 example: 60.00
 *     responses:
 *       200:
 *         description: Preço atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar preço
 */
app.put('/precos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, valor } = req.body;
    await atualizarPreco(id, nome, valor);
    res.status(200).send({ id, nome, valor });
  } catch (error) {
    console.error('Erro ao atualizar preço:', error);
    res.status(500).send({ error: 'Erro ao atualizar preço' });
  }
});
/**
 * @swagger
 * /precos/{id}:
 *   delete:
 *     summary: Exclui um preço
 *     description: Remove um preço cadastrado pelo ID.
 *     tags: [Preços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do preço
 *     responses:
 *       204:
 *         description: Preço excluído com sucesso
 *       500:
 *         description: Erro ao excluir preço
 */
app.delete('/precos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await excluirPreco(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir preço:', error);
    res.status(500).send({ error: 'Erro ao excluir preço' });
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Iniciar o servidor

app.use('/', adminRoutes); // Usa as rotas de administração

// Definição da porta
const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.error("Erro ao iniciar o servidor:", error);
  } else {
    console.log(`Servidor rodando na porta ${PORT}`);
  }
});
