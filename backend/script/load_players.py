import sqlite3
import json

conn = sqlite3.connect('players.db')
with open('D:/Progetti/FantaVolley/backend/app/data/giocatori.json', 'r') as json_file:
    data = json.load(json_file)
    index = 1
    conn.execute('''CREATE TABLE IF NOT EXISTS player (
                id INTEGER PRIMARY KEY,
                nome TEXT,
                ruolo TEXT,
                squadra TEXT,
                squadra_id INTEGER,
                numero INTEGER,
                nascita TEXT,
                nazione TEXT,
                altezza REAL,
                codice TEXT,
                url_giocatore TEXT,
                url_squadra TEXT,
                url_foto TEXT,
                url_card TEXT
            )''')

    for item in data:
        conn.execute("INSERT INTO player (nome, ruolo, squadra, squadra_id, numero, nascita, nazione, altezza, codice, url_giocatore, url_squadra, url_foto, url_card, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (item["nome"], item["ruolo"], item["squadra"], item["squadra_id"], item["codice"], item["numero"], item["nascita"], item["nazione"], item["altezza"], item["url_giocatore"], item["url_squadra"], item["url_foto"], item["url_card"], index))
        index += 1
conn.commit()
conn.close()
