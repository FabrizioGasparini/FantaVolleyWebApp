import sqlite3
import json

conn = sqlite3.connect('data.db')
with open('giocatori.json', 'r') as json_file:
    data = json.load(json_file)
    for item in data:
        conn.execute("INSERT INTO player (nome, ruolo, squadra, squadra_id, numero, nascita, nazione, altezza, url_giocatore, url_squadra, url_foto, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (item["nome"], item["ruolo"], item["squadra"], item["squadra_id"], item["numero"], item["nascita"], item["nazione"], item["altezza"], item["url_giocatore"], item["url_squadra"], item["url_foto"], item["id"]))
conn.commit()
conn.close()
