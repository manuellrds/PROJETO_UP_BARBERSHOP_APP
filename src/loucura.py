import mysql.connector
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from dotenv import load_dotenv
import os
import requests

# Carregar as variáveis de ambiente
load_dotenv()

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
    try:
        response = requests.get("http://192.168.192.145:3000/agendamentos/completos")
        response.raise_for_status()  # Vai lançar um erro se o status não for 200
        agendamentos = response.json()

        df = pd.DataFrame(agendamentos)
        return df
    except requests.exceptions.RequestException as e:
        print(f"Erro ao carregar agendamentos: {e}")
        return pd.DataFrame()

# Caminho para salvar as imagens
CAMINHO_ASSETS = r"C:\Users\vazgt\Music\devbarber_comgrafico\DevBarber\DevBarber\DevBarber\app\src\agoravai"

# Função para gerar gráfico de agendamentos por barbeiro
def grafico_agendamentos_por_barbeiro(df):
    agendamentos_por_barbeiro = df['barbeiro_nome'].value_counts().reset_index()
    agendamentos_por_barbeiro.columns = ['barbeiro_nome', 'count']

    plt.figure(figsize=(10, 6))
    sns.barplot(data=agendamentos_por_barbeiro, x='barbeiro_nome', y='count', palette='viridis', hue='barbeiro_nome', legend=False)
    plt.title('Número de Agendamentos por Barbeiro')
    plt.xlabel('Barbeiro')
    plt.ylabel('Número de Agendamentos')
    plt.xticks(rotation=45)
    plt.tight_layout()

    if not os.path.exists(CAMINHO_ASSETS):
        os.makedirs(CAMINHO_ASSETS)
        print(f"Pasta criada: {CAMINHO_ASSETS}")

    arquivo = os.path.join(CAMINHO_ASSETS, 'agendamentos_por_barbeiro.jpg')
    print(f"Salvando gráfico em: {arquivo}")
    plt.savefig(arquivo, format='jpg')
    plt.close()
    os.startfile(arquivo)

# Função para gerar gráfico de agendamentos por corte
def grafico_agendamentos_por_corte(df):
    agendamentos_por_corte = df['corte_nome'].value_counts().reset_index()
    agendamentos_por_corte.columns = ['corte_nome', 'count']

    plt.figure(figsize=(10, 6))
    sns.barplot(data=agendamentos_por_corte, x='corte_nome', y='count', palette='coolwarm', hue='corte_nome', legend=False)
    plt.title('Número de Agendamentos por Corte')
    plt.xlabel('Corte')
    plt.ylabel('Número de Agendamentos')
    plt.xticks(rotation=45)
    plt.tight_layout()

    if not os.path.exists(CAMINHO_ASSETS):
        os.makedirs(CAMINHO_ASSETS)
        print(f"Pasta criada: {CAMINHO_ASSETS}")

    arquivo = os.path.join(CAMINHO_ASSETS, 'agendamentos_por_corte.jpg')
    print(f"Salvando gráfico em: {arquivo}")
    plt.savefig(arquivo, format='jpg')
    plt.close()
    os.startfile(arquivo)

# Função para gerar gráfico de média de cortes por cliente
def grafico_media_cortes(df):
    media_cortes = df.groupby('cliente_nome')['corte_nome'].count().reset_index()
    media_cortes.columns = ['cliente_nome', 'media_cortes']

    plt.figure(figsize=(10, 6))
    sns.barplot(data=media_cortes, x='cliente_nome', y='media_cortes', palette='Blues_d', hue='cliente_nome', legend=False)
    plt.title('Média de Cortes por Cliente')
    plt.xlabel('Cliente')
    plt.ylabel('Média de Cortes')
    plt.xticks(rotation=45)
    plt.tight_layout()

    if not os.path.exists(CAMINHO_ASSETS):
        os.makedirs(CAMINHO_ASSETS)
        print(f"Pasta criada: {CAMINHO_ASSETS}")

    arquivo = os.path.join(CAMINHO_ASSETS, 'media_cortes_por_cliente.jpg')
    print(f"Salvando gráfico em: {arquivo}")
    plt.savefig(arquivo, format='jpg')
    plt.close()
    os.startfile(arquivo)

# Função principal para realizar a análise
def main():
    df = carregar_agendamentos()

    if df.empty:
        print("Nenhum agendamento encontrado.")
        return

    print(df.head())

    grafico_agendamentos_por_barbeiro(df)
    grafico_agendamentos_por_corte(df)
    grafico_media_cortes(df)

if __name__ == '__main__':
    main()
    