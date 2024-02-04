# import sqlite3
# import json

# conn = sqlite3.connect('players.db')
# conn.execute("CREATE TABLE giocatori (nome text, ruolo text, squadra text, squadra_id int, numero text, nascita text, nazione text, altezza text, url_giocatore text, url_squadra text, url_foto text, id int);")
# with open('giocatori.json', 'r') as json_file:
#     data = json.load(json_file)
#     for item in data:
#         conn.execute("INSERT INTO giocatori (nome, ruolo, squadra, squadra_id, numero, nascita, nazione, altezza, url_giocatore, url_squadra, url_foto, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (item["nome"], item["ruolo"], item["squadra"], item["squadra_id"], item["numero"], item["nascita"], item["nazione"], item["altezza"], item["url_giocatore"], item["url_squadra"], item["url_foto"], item["id"]))
# conn.commit()
# conn.close()

import sqlite3

def unisci_database(principale_path, secondario_path):
    # Connessione al database principale
    conn_principale = sqlite3.connect(principale_path)
    cursor_principale = conn_principale.cursor()

    # Attach del database secondario
    cursor_principale.execute(f"ATTACH DATABASE '{secondario_path}' AS secondario;")

    # Esempio di unione delle tabelle user, player, e expired_token dei due database
    query_unione = """
    CREATE TABLE IF NOT EXISTS user AS
    SELECT * FROM user
    UNION
    SELECT * FROM user;

    CREATE TABLE IF NOT EXISTS player AS
    SELECT * FROM player
    UNION
    SELECT * FROM player;

    CREATE TABLE IF NOT EXISTS expired_token AS
    SELECT * FROM expired_token
    UNION
    SELECT * FROM expired_token;
    """
    cursor_principale.executescript(query_unione)

    # Committa le modifiche e distacca il database secondario
    conn_principale.commit()
    cursor_principale.execute("DETACH DATABASE secondario;")

    # Chiudi la connessione
    conn_principale.close()

# Esempio di utilizzo
database_principale = "data.db"
database_secondario = "new.db"
unisci_database(database_principale, database_secondario)
