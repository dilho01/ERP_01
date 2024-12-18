import React from "react";
import "../css/Rodape.css"; // Arquivo CSS para o estilo do rodapé

const Footer = () => {
  return (
    <footer>
      <p>
        Sistema desenvolvido pela{" "}
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          Ted Soluções em Tecnologia
        </a>
      </p>
      <p>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>{" "}
        |{" "}
        <a href="https://wa.me/00000000000" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </p>
    </footer>
  );
};

export default Footer;
