# import requests
# from bs4 import BeautifulSoup

# lettere = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

# counter = 0
# players = []
# for lettera in lettere:
#     url = f'https://www.legavolley.it/ricerca/?Lettera={lettera}&TipoOgg=ATL'
#     headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

#     response = requests.get(url, headers=headers)
#     soup = BeautifulSoup(response.text, 'html.parser')

#     player_table = soup.find_all(class_='Ricerca')[1].find_all('tr')
#     player_table.pop(0)

#     for player in player_table:
#             player_data = {"nome": "", "url_foto": "", "codice": ""}

#             stagione = player.find_all('td', id="OddCol")[1].text.strip() 
#             if stagione != "2023":
#                 continue 

#             serie = player.find_all('td', id="OddCol")[2].text.strip() 
#             if serie != "A1":
#                 continue 

#             nome = player.find_all('td', class_="DettaglioA")[1].text.strip()
#             player_data["nome"] = nome
          
#             url_giocatore = player.find_all('td', class_="DettaglioA")[1].get('onclick').split("'")[1]  

#             url_squadra = player.find_all('td', class_="DettaglioA")[2].get('onclick').split("'")[1]  

#             foto = f"https://www.legavolley.it/Foto.aspx?Key={url_giocatore.split('player/')[1]}&sqid={url_squadra.split('team/')[1]}"
#             player_data["url_foto"] = foto

#             codice = url_giocatore.split('player/')[1]
#             player_data["codice"] = codice

#             headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

#             players.append(player_data)
            
#             counter += 1
#             print(counter)

# print(players)


import os
import json

file1 = open('D:/Progetti/FantaVolley/backend/app/data/giocatori.json', 'r')
file2 = open('D:/Progetti/FantaVolley/backend/app/data/new_giocatori.json', 'w')
file3 = open('D:/Progetti/FantaVolley/backend/script/test.json', 'r')

file_json = json.loads(file1.read())

for player in file_json:
    codice = player["codice"]
    file2.write(f"\nhttps://playerimages.fra1.digitaloceanspaces.com/rectangles/{codice}.png")      


# for i, line in enumerate(lines):
#     if '"nome"' in line:
#         nome = line.split('nome":')[1].split('"')[0]

        
#         file2.write(f'\t   "url_giocatore": "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/{player_code}.png",\n')

        
    
#    file2.write(line)
