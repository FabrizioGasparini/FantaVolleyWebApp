import os

class Config:
    # Chiavi segrete per la sicurezza dell'applicazione, cambiale nel tuo ambiente di produzione
    SECRET_KEY = '1234'

    SQLALCHEMY_DATABASE_URI = "sqlite:///users.sqlite3"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    print(SQLALCHEMY_DATABASE_URI)

    # Impostazione per abilitare il CSRF protection
    WTF_CSRF_ENABLED = True
