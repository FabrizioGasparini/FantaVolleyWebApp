import sqlite3 
from app.models.database import db
from app.models.expired_token import ExpiredToken

class Player(db.Model):
    nome = db.Column(db.String(100), nullable=False)
    ruolo = db.Column(db.String(100), nullable=False)
    squadra = db.Column(db.String(100), nullable=False)
    squadra_id = db.Column(db.Integer, nullable=False)
    numero = db.Column(db.String(100), nullable=False)
    nascita = db.Column(db.String(100), nullable=False)
    nazione = db.Column(db.String(100), nullable=False)
    altezza = db.Column(db.String(100), nullable=False)
    codice = db.Column(db.String(10), nullable=False)
    url_giocatore = db.Column(db.String(100), nullable=False)
    url_squadra = db.Column(db.String(100), nullable=False)
    url_foto = db.Column(db.String(100), nullable=False)
    url_card = db.Column(db.String(100), nullable=False)
    id = db.Column(db.Integer, primary_key=True)

    def __init__(self, nome, ruolo, squadra, squadra_id, numero, nascita, codice, nazione, altezza, url_giocatore, url_squadra, url_foto, url_card):
        self.nome = nome
        self.ruolo = ruolo
        self.squadra = squadra
        self.squadra_id = squadra_id
        self.numero = numero
        self.nascita = nascita
        self.nazione = nazione
        self.altezza = altezza
        self.codice = codice
        self.url_giocatore = url_giocatore
        self.url_squadra = url_squadra
        self.url_foto = url_foto
        self.url_card = url_card

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def remove_from_db(self):
        db.session.delete(self)
        db.session.commit()
    

    def to_json(self):
        return {
            'nome': self.nome,
            'ruolo': self.ruolo,
            'squadra': self.squadra,
            'squadra_id': self.squadra_id,
            'numero': self.numero,
            'nascita': self.nascita,
            'nazione': self.nazione,
            'altezza': self.altezza,
            'codice': self.codice,
            'url_giocatore': self.url_giocatore,
            'url_squadra': self.url_squadra,
            'url_foto': self.url_foto,
            'url_card': self.url_card,
            'id': self.id
        }
