#!/bin/bash

# Lo script è progettato per l'utilizzo su questa VM, non è garantito il funzionamento su macchine diverse 
echo "### Avvio XAMPP... ###"
sudo /opt/lampp/xampp start

cd ./network/Ticket4U-net;
echo "### Avvio la blockchain: Ticket4U-net... ###"
bash start.sh;
cd ../../

echo "### Avvio il server nodejs... ###\n### (Effettuare il refresh se le pagine non vengono caricate automaticamente) ###"
xdg-open localhost:8888 &
xdg-open localhost:8999 &
npm start;