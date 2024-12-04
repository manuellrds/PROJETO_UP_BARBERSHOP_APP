from flask import Flask, send_from_directory, render_template_string, jsonify
import os
import subprocess

app = Flask(__name__)

# Caminho da pasta onde as imagens serão armazenadas
ASSETS_DIR = r"C:\Users\vazgt\Music\devbarber_comgrafico\DevBarber\DevBarber\DevBarber\app\src\agoravai"

# Rota para exibir uma imagem específica
@app.route('/imagem/<nome_imagem>')
def exibir_imagem(nome_imagem):
    print(f"Servindo imagem: {nome_imagem}")
    return send_from_directory(ASSETS_DIR, nome_imagem)

# Rota para exibir todas as imagens
@app.route('/imagens')
def exibir_imagens():
    imagens = os.listdir(ASSETS_DIR)
    imagens_html = ''.join([f'<img src="/imagem/{img}" style="width:200px;"/>' for img in imagens])
    print("Servindo as seguintes imagens:", imagens)
    return render_template_string(f'''
        <h1>Imagens Geradas</h1>
        <div>{imagens_html}</div>
    ''')

# Endpoint para gerar gráficos
@app.route('/gerar-graficos', methods=['GET'])
def gerar_graficos():
    try:
        # Executar o script que gera os gráficos
        subprocess.run(['python', 'loucura.py'], check=True)
        return jsonify({"message": "Gráficos gerados com sucesso."}), 200
    except subprocess.CalledProcessError as e:
        return jsonify({"message": "Erro ao gerar gráficos."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
