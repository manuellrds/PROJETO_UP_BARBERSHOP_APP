from flask import Flask, send_from_directory
import mysql.connector
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from dotenv import load_dotenv
import os
import requests

# Carregar as variáveis de ambiente
load_dotenv()

app = Flask(__name__)

# Função para se conectar ao banco de dados MySQL
def conectar_db():
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )
    return conn

# Função para carregar os agendamentos
def carregar_agendamentos():
    conn = conectar_db()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM agendamentos"  # Ajuste conforme a estrutura do banco
    cursor.execute(query)
    agendamentos = cursor.fetchall()
    conn.close()
    return pd.DataFrame(agendamentos)

# Função para gerar gráfico de agendamentos por barbeiro
def grafico_agendamentos_por_barbeiro(df):
    # Contar quantos agendamentos por barbeiro
    agendamentos_por_barbeiro = df['barbeiro_nome'].value_counts().reset_index()
    agendamentos_por_barbeiro.columns = ['barbeiro_nome', 'count']

    # Gerar gráfico de barras
    plt.figure(figsize=(10, 6))
    sns.barplot(data=agendamentos_por_barbeiro, x='barbeiro_nome', y='count', palette='viridis')
    plt.title('Número de Agendamentos por Barbeiro')
    plt.xlabel('Barbeiro')
    plt.ylabel('Número de Agendamentos')
    plt.xticks(rotation=45)
    plt.tight_layout()

    caminho_assets = os.path.join(os.path.dirname(__file__), 'assets')
    if not os.path.exists(caminho_assets):
        os.makedirs(caminho_assets)

    # Salvar o gráfico
    arquivo = os.path.join(caminho_assets, 'agendamentos_por_barbeiro.jpg')
    plt.savefig(arquivo, format='jpg')
    plt.close()
    return 'agendamentos_por_barbeiro.jpg'

# Função para gerar gráfico de agendamentos por corte
def grafico_agendamentos_por_corte(df):
    # Contar quantos agendamentos por corte
    agendamentos_por_corte = df['corte_nome'].value_counts().reset_index()
    agendamentos_por_corte.columns = ['corte_nome', 'count']

    # Gerar gráfico de barras
    plt.figure(figsize=(10, 6))
    sns.barplot(data=agendamentos_por_corte, x='corte_nome', y='count', palette='coolwarm')
    plt.title('Número de Agendamentos por Corte')
    plt.xlabel('Corte')
    plt.ylabel('Número de Agendamentos')
    plt.xticks(rotation=45)
    plt.tight_layout()

    caminho_assets = os.path.join(os.path.dirname(__file__), 'assets')
    if not os.path.exists(caminho_assets):
        os.makedirs(caminho_assets)

    # Salvar o gráfico
    arquivo = os.path.join(caminho_assets, 'agendamentos_por_corte.jpg')
    plt.savefig(arquivo, format='jpg')
    plt.close()
    return 'agendamentos_por_corte.jpg'

# Função para gerar gráfico de média de cortes por cliente
def grafico_media_cortes(df):
    media_cortes = df.groupby('cliente_nome')['corte_nome'].count().reset_index()
    media_cortes.columns = ['cliente_nome', 'media_cortes']

    # Gerar gráfico de barras
    plt.figure(figsize=(10, 6))
    sns.barplot(data=media_cortes, x='cliente_nome', y='media_cortes', palette='Blues_d')
    plt.title('Média de Cortes por Cliente')
    plt.xlabel('Cliente')
    plt.ylabel('Média de Cortes')
    plt.xticks(rotation=45)
    plt.tight_layout()

    caminho_assets = os.path.join(os.path.dirname(__file__), 'assets')
    if not os.path.exists(caminho_assets):
        os.makedirs(caminho_assets)

    # Salvar o gráfico
    arquivo = os.path.join(caminho_assets, 'media_cortes_por_cliente.jpg')
    plt.savefig(arquivo, format='jpg')
    plt.close()
    return 'media_cortes_por_cliente.jpg'

# Rota para gerar os gráficos
@app.route('/gerar-graficos', methods=['GET'])
def gerar_graficos():
    # Carregar dados de agendamentos do banco
    df = carregar_agendamentos()

    if df.empty:
        return "Nenhum agendamento encontrado", 404

    # Gerar gráficos
    grafico_agendamentos_por_barbeiro(df)
    grafico_agendamentos_por_corte(df)
    grafico_media_cortes(df)

    return "Gráficos gerados com sucesso!", 200

# Rota para servir as imagens geradas
@app.route('/assets/<filename>')
def serve_image(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'assets'), filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
