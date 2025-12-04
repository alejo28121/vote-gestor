import { jsPDF } from "jspdf";

function DowloadDates(votes) {
    const doc = new jsPDF({ unit: "pt", format: "letter" });

    const tipoToText = (t) =>
        t === 1 ? "Presidencia" : t === 2 ? "Cámara" : t === 3 ? "Concejo" : "Desconocido";

    let y = 40;

    doc.setFontSize(22);
    doc.text("Reporte de Votos", 40, y);
    y += 30;

    votes.forEach((item, index) => {
        if (y > 760) {
            doc.addPage();
            y = 40;
        }

        doc.setFontSize(14);
        doc.text(`${index + 1}. ${item.candidate}`, 40, y);
        y += 18;

        doc.setFontSize(12);
        doc.text(`Cargo: ${tipoToText(item.tipo)}`, 60, y);
        y += 15;

        doc.text(`Votos: ${item.votes}`, 60, y);
        y += 15;

        doc.text(`Zona: ${item.zone}`, 60, y);
        y += 22;
    });

    doc.save("votos.pdf");
}
export default DowloadDates;