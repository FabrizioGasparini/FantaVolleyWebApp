import tkinter as tk
from tkinter import messagebox
from tkinter.simpledialog import askstring
import requests

class APITesterApp:
    def __init__(self, root):
        self.root = root
        self.root.title("API Tester")

        self.base_url = "http://localhost:5000/api/v1"
        self.path = []
        self.parameters = {}

        self.create_widgets()

    def create_widgets(self):
            tk.Label(self.root, text="Seleziona il percorso dell'endpoint:").pack()

            self.path_frame = tk.Frame(self.root)
            self.path_frame.pack()

            self.path_label = tk.Label(self.path_frame, text="/")
            self.path_label.pack(side=tk.LEFT)

            self.choose_button = tk.Button(self.path_frame, text="Scegli", command=self.choose_endpoint)
            self.choose_button.pack(side=tk.LEFT)

            self.parameters_frame = tk.Frame(self.root)
            self.parameters_frame.pack()

            self.parameter_entries = []

            self.add_button = tk.Button(self.parameters_frame, text="Aggiungi Parametro", command=self.add_parameter_row)
            self.add_button.pack()

            self.send_button = tk.Button(self.root, text="Invia", command=self.send_request)
            self.send_button.pack()

    def choose_endpoint(self):
        endpoint_choice = askstring("Scegliere Endpoint", "Inserisci il prossimo livello dell'endpoint:")
        if endpoint_choice:
            self.path.append(endpoint_choice)
            self.update_path_label()
            self.choose_endpoint()

    def update_path_label(self):
        self.path_label.config(text="/" + "/".join(self.path))

    def add_parameter_row(self):
        parameter_row = tk.Frame(self.parameters_frame)
        parameter_row.pack()

        key_entry = tk.Entry(parameter_row)
        key_entry.pack(side=tk.LEFT)

        value_entry = tk.Entry(parameter_row)
        value_entry.pack(side=tk.LEFT)

        self.parameter_entries.append((key_entry, value_entry))

    def send_request(self):
        for key_entry, value_entry in self.parameter_entries:
            key = key_entry.get()
            value = value_entry.get()
            if key and value:
                self.parameters[key] = value

        endpoint = self.base_url + "/" + "/".join(self.path)
        try:
            response = requests.post(endpoint, json=self.parameters)
            messagebox.showinfo("Risposta dall'API", f"Stato: {response.status_code}\nRisposta: {response.json()}")
        except Exception as e:
            messagebox.showerror("Errore", f"Si è verificato un errore durante la richiesta: {str(e)}")


if __name__ == "__main__":
    root = tk.Tk()
    app = APITesterApp(root)
    root.mainloop()