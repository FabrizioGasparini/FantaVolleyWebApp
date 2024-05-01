import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Players from "./pages/Players";
import PlayerDetails from "./pages/dynamic/player/PlayerDetails";
import Logout from "./pages/Logout";
import Leagues from "./pages/Leagues";
import Stats from "./pages/Stats";
import Rules from "./pages/Rules";
import League from "./pages/dynamic/league/League";
import Roster from "./pages/dynamic/league/roster/Roster";
import Auction from "./pages/dynamic/league/auction/Auction";
import { useEffect, useState } from "react";

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const images = [
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ACQ-ALE-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ALL-AIM-88.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ALO-ROA-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/AND-ROB-90.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ANZ-SIM-92.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BAL-AND-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BAL-FAB-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BAR-MIC-89.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BAS-LUK-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BAY-EFE-02.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BEN-WAS-96.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BER-MAR-03.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BER-THO-90.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BIS-FRA-02.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BON-FED-04.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BON-MAT-04.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BON-PIE-05.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BOS-ELI-94.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BOT-MAT-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BRE-ANT-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BRI-ANT-94.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/BUC-PAU-96.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/CAN-DAV-89.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/CAN-EDO-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/CAR-JUL-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/CAT-DAM-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/CAV-DOM-87.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/CAV-ORE-96.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/CHI-BAR-98.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/COL-LUC-04.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/COL-MAS-85.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/COM-FRA-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/COR-LOR-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/CRO-FED-02.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/CZE-MIC-03.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/DAM-FRA-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/DAV-ULA-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/DEC-LUC-88.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/DES-MAT-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/DES-SAV-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/DHE-WOU-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/DIA-BRU-03.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/DIA-ENR-93.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/DIM-GAB-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/DIR-PET-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/DZA-DON-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/EKS-HAM-03.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ESM-AMI-96.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/FAL-MAR-03.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/FAU-THE.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/FED-FIL-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/FIN-ALE-04.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/FRU-CRI-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/FUS-FRA-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GAG-MAR-02.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GAL-GIA-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GAR-DAV-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GAR-GAB-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GAR-GIO-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GIA-LOR-02.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GIA-SIM-96.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GIR-FAB-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GOL-RIC-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GRO-ALE-98.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GUA-FLA-93.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GUT-JOS-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/GUZ-TOM-02.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/HEL-TIM-98.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/HER-JES-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/HOF-NIC-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/INN-AND-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ISH-YUK-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/JEN-JEF-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/JOV-NIK-92.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/JUA-OSM-85.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/KAZ-MAT-84.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/KEI-NOU-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/KOZ-JAN-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/KRE-FER.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LAG-ADI-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LAN-FIL-91.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LAR-JAC-98.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LAU-GAB-03.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LAV-DAN-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LAW-IBR-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LEA-YAN-98.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LEO-WIL-93.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LOE-ERI-98.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LOS-AGU-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LUC-RIC-92.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/LUZ-DAV-04.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MAA-STE-94.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MAG-GIU-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MAN-MOH-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MAS-JAC-88.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MAS-NEM-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MAZ-DAN-92.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MEL-OSN-87.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MIC-ALE-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MOR-FLA-05.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MOS-BRU-86.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MOS-LEA-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MOT-MAT-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MOZ-ROK-02.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/MUJ-NIK-04.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/NED-ALE-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/NEL-GAB-93.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/NIK-ALE-03.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ORD-SAN-83.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/PAC-DOM-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/PAG-LUC-04.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/PER-PAV-98.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/PIA-MAT-90.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/PIC-ALE-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/PIE-FRA-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/PIN-GIU-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/PIN-ROB-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/PLA-FAB-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/PLO-OLE-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/POD-MAR-87.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/POR-LUC-03.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/POR-PAO-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/RAF-GIA-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/RAM-JOR-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/RAN-LUI-94.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/REC-FRA-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/REG-FER-03.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/RIC-FAB-94.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/RIN-TOM-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/RIZ-MAR-90.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ROM-YUR-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ROP-GRE-89.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ROS-AND-89.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/RUS-DAV-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/RUS-KYL-93.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/RUS-ROB-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/RYC-KAM-96.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SAI-DAV-87.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SAL-LOR-02.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SAN-FIL-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SAN-FRA-02.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SAN-GIO-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SAP-MAK-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SBE-RIC-98.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SCA-LEO-98.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SEM-KAM-96.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SIG-NIC-94.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SIM-ROB-87.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SOL-SEB-91.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SPI-LUC-93.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/STA-DRA-85.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/STE-TOM-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/SZW-ART-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/TAK-RAN-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/TAN-WAT-96.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/THE-JAK-99.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/TON-ALE-91.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/TOS-ALE-98.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/TRI-ANG-93.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/TRU-AND-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/TRU-AXE-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/VIS-PET-98.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/VIT-MAR-96.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/YAN-MAR-01.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ZAN-AND-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ZAP-ENR-95.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ZAY-IVA-88.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ZEN-JUL-97.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ZIN-AID-90.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ZON-NIC-00.png",
            "https://playerimages.fra1.digitaloceanspaces.com/2023/rookie/ZOP-FRA-97.png",
        ];

        cacheImages(images);
    });

    const cacheImages = async (srcArray) => {
        const promises = await srcArray.map((src) => {
            return new Promise(function (resolve, reject) {
                const img = new Image();

                img.src = src;
                img.onload = resolve();
                Image.onerror = reject();
            });
        });

        await Promise.all(promises);
        setIsLoading(false);
    };

    return (
        <div className="app">
            {isLoading == false ? (
                <Router>
                    <Routes>
                        <Route element={<PrivateRoutes />}>
                            <Route element={<Home />} path="/" />
                            <Route element={<Account />} path="/account" />
                            <Route element={<Leagues />} path="/leagues" />
                            <Route
                                element={<League />}
                                path="/leagues/:invite_code"
                            />
                            <Route
                                element={<Roster />}
                                path="/leagues/:invite_code/roster"
                            />
                            <Route
                                element={<Auction />}
                                path="/leagues/:invite_code/auction"
                            />
                        </Route>
                        <Route element={<Stats />} path="/stats" />
                        <Route element={<Players />} path="/players" />
                        <Route
                            element={<PlayerDetails />}
                            path="/players/:id"
                        />
                        <Route element={<Rules />} path="/rules" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Logout />} path="/logout" />
                    </Routes>
                </Router>
            ) : (
                ""
            )}
        </div>
    );
}

export default App;
