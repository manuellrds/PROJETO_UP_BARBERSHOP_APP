create database barber_dados;
use barber_dados;
CREATE TABLE usuarios (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  senha varchar(255) NOT NULL,
  role varchar(255) DEFAULT 'user',
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
)

CREATE TABLE horarios (
  id int NOT NULL AUTO_INCREMENT,
  horario time DEFAULT NULL,
  status varchar(255) NOT NULL DEFAULT 'pendente',
  data datetime DEFAULT NULL,
  hora time NOT NULL,
  disponivel tinyint(1) DEFAULT '1',
  PRIMARY KEY (id)
)

CREATE TABLE feedback (
  id int NOT NULL AUTO_INCREMENT,
  mensagem text NOT NULL,
  data timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)

CREATE TABLE cortes (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  image varchar(255) DEFAULT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  descricao text,
  nome varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
)

CREATE TABLE barbeiros (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(512) NOT NULL,
  horario_id int DEFAULT NULL,
  especialidade varchar(512) NOT NULL,
  PRIMARY KEY (id),
  KEY fk_horario_new (horario_id),
  CONSTRAINT fk_horario_new FOREIGN KEY (horario_id) REFERENCES horarios (id) ON DELETE SET NULL
)

CREATE TABLE agendamentos (
  id int NOT NULL AUTO_INCREMENT,
  barbeiro_id int DEFAULT NULL,
  horario_id int DEFAULT NULL,
  usuario_id int DEFAULT NULL,
  corte varchar(255) DEFAULT NULL,
  data date DEFAULT NULL,
  cliente varchar(255) NOT NULL,
  PRIMARY KEY (id),
  KEY barbeiro_id (barbeiro_id),
  KEY horario_id (horario_id),
  KEY usuario_id (usuario_id),
  CONSTRAINT agendamentos_ibfk_1 FOREIGN KEY (barbeiro_id) REFERENCES barbeiros (id),
  CONSTRAINT agendamentos_ibfk_2 FOREIGN KEY (horario_id) REFERENCES horarios (id),
  CONSTRAINT agendamentos_ibfk_3 FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
)