const express = require('express');
const router = express.Router();
const db = require('../database'); // Conexão com o banco de dados MySQL

/**
 * @swagger
 * /cortes:
 *   post:
 *     summary: Cria um novo corte
 *     description: Endpoint para criar um novo corte
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
 *               preco:
 *                 type: number
 *     responses:
 *       201:
 *         description: Corte adicionado com sucesso!
 *       400:
 *         description: Nome e preço do corte são obrigatórios!
 *       500:
 *         description: Erro ao adicionar corte
 */
router.post('/cortes', async (req, res) => {
  const { nome, preco } = req.body;

  if (!nome || !preco) {
    return res.status(400).send({ message: 'Nome e preco do corte são obrigatórios!' });
  }

  const query = 'INSERT INTO cortes (nome, preco) VALUES (?, ?)';
  try {
    await db.execute(query, [nome, preco]);
    res.status(201).send({ message: 'Corte adicionado com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao adicionar corte', error });
  }
});

/**
 * @swagger
 * /cortes:
 *   get:
 *     summary: Lista todos os cortes
 *     description: Endpoint para listar todos os cortes cadastrados
 *     tags: [Cortes]
 *     responses:
 *       200:
 *         description: Retorna todos os cortes cadastrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   preco:
 *                     type: number
 *       500:
 *         description: Erro ao buscar cortes
 */
router.get('/cortes', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM cortes');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar cortes', error });
  }
});

/**
 * @swagger
 * /horarios:
 *   post:
 *     summary: Cria um novo horário
 *     description: Endpoint para criar um novo horário
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
 *               disponivel:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Horário adicionado com sucesso!
 *       400:
 *         description: Hora e status de disponibilidade são obrigatórios!
 *       500:
 *         description: Erro ao adicionar horário
 */
router.post('/horarios', async (req, res) => {
  const { hora, disponivel } = req.body;

  if (!hora || disponivel === undefined) {
    return res.status(400).send({ message: 'Hora e status de disponibilidade são obrigatórios!' });
  }

  const query = 'INSERT INTO horarios (hora, disponivel) VALUES (?, ?)';
  try {
    await db.execute(query, [hora, disponivel]);
    res.status(201).send({ message: 'Horário adicionado com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao adicionar horário', error });
  }
});

/**
 * @swagger
 * /horarios:
 *   get:
 *     summary: Lista todos os horários
 *     description: Endpoint para listar todos os horários cadastrados
 *     tags: [Horários]
 *     responses:
 *       200:
 *         description: Retorna todos os horários cadastrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   hora:
 *                     type: string
 *                   disponivel:
 *                     type: boolean
 *       500:
 *         description: Erro ao buscar horários
 */
router.get('/horarios', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM horarios');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar horários', error });
  }
});

/**
 * @swagger
 * /barbeiros:
 *   post:
 *     summary: Cria um novo barbeiro
 *     description: Endpoint para criar um novo barbeiro
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
 *               especialidade:
 *                 type: string
 *     responses:
 *       201:
 *         description: Barbeiro adicionado com sucesso!
 *       500:
 *         description: Erro ao adicionar barbeiro
 */
router.post('/barbeiros', async (req, res) => {
  const { nome, especialidade } = req.body;
  const query = 'INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?)';
  try {
    await db.execute(query, [nome, especialidade]);
    res.status(201).send({ message: 'Barbeiro adicionado com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao adicionar barbeiro', error });
  }
});

/**
 * @swagger
 * /barbeiros:
 *   get:
 *     summary: Lista todos os barbeiros
 *     description: Endpoint para listar todos os barbeiros cadastrados
 *     tags: [Barbeiros]
 *     responses:
 *       200:
 *         description: Retorna todos os barbeiros cadastrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   especialidade:
 *                     type: string
 *       500:
 *         description: Erro ao buscar barbeiros
 */
router.get('/barbeiros', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM barbeiros');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar barbeiros', error });
  }
});

module.exports = router;
