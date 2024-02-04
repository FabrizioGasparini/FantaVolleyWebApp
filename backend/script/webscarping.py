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
#             player_data = {"nome": "", "ruolo": "", "squadra": "", "numero": "", "nascita": "", "nazionalità": "", "altezza": "", "url_giocatore": "", "url_squadra": "", "url_foto": ""}

#             stagione = player.find_all('td', id="OddCol")[1].text.strip() 
#             if stagione != "2023":
#                 continue 

#             serie = player.find_all('td', id="OddCol")[2].text.strip() 
#             if serie != "A1":
#                 continue 

#             nome = player.find_all('td', class_="DettaglioA")[1].text.strip()
#             player_data["nome"] = nome
            
#             ruolo = player.find_all('td', id="OddCol")[0].text.strip()  
#             player_data["ruolo"] = ruolo

#             squadra = player.find_all('td', class_="DettaglioA")[2].text.strip()  
#             player_data["squadra"] = squadra
          
#             url_giocatore = player.find_all('td', class_="DettaglioA")[1].get('onclick').split("'")[1]  
#             player_data["url_giocatore"] = url_giocatore

#             url_squadra = player.find_all('td', class_="DettaglioA")[2].get('onclick').split("'")[1]  
#             player_data["url_squadra"] = url_squadra

#             foto = f"https://www.legavolley.it/Foto.aspx?Key={url_giocatore.split('player/')[1]}&sqid={url_squadra.split('team/')[1]}"
#             player_data["url_foto"] = foto


#             headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

#             # URL ATLETA
#             response = requests.get(url_giocatore, headers=headers)
#             soup = BeautifulSoup(response.text, 'html.parser')

#             number = soup.find(class_='atleta-info').find('span').text.split('#')[1]
#             player_data["numero"] = number

#             info = soup.find_all(class_='atleta-label')

#             nascita = info[0].text.split("Nascita ")[1]
#             player_data["nascita"] = nascita

#             naz = info[2].text.split("Naz.Sportiva ")[1]
#             player_data["nazionalità"] = naz

#             altezza = info[4].text.split("Altezza ")[1]
#             player_data["altezza"] = altezza

#             players.append(player_data)
            
#             counter += 1
#             print(counter)

# print(players)


import os

file = open('D:/Progetti/FantaVolley/backend/app/data/giocatori.json', 'r')
file2 = open('D:/Progetti/FantaVolley/backend/app/data/new_giocatori.json', 'w')

lines = file.readlines()
    
squadre = {}
index = 1
for i, line in enumerate(lines):
    if '"squadra' in line:
        new_line = line.split(':"')[1].split('"')[0]
        if new_line in squadre:
            file2.write(f'\t   "squadra_id": {squadre[new_line]},\n')
        else:
            squadre[new_line] = index
            file2.write(f'\t   "squadra_id": {index},\n')
            index += 1
        
    
    file2.write(line)