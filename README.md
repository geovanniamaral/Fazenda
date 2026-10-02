# 🌿 Fazenda Rio Acima - Site Oficial de Divulgação

Site moderno, responsivo e de alta conversão desenvolvido para a **Fazenda Rio Acima**, localizada em **Pedreira - SP (Bairro Entre Montes)**.

---

## 📸 1. Sobre as Fotos Reais & Como Trocar / Vincular

- **Fotos Integradas:** As fotos exibidas no site estão separadas por assunto dentro de `assets/images/site/`. Os originais permanecem preservados em `assets/images/`.
- **Guia Completo com Linhas e Códigos:** Consulte o arquivo [COMO_VINCULAR_E_TROCAR_FOTOS.md](file:///c:/Users/Elen/OneDrive/Compartilhado/Fazenda/COMO_VINCULAR_E_TROCAR_FOTOS.md) na raiz do projeto para ver a tabela com a linha exata de cada foto no `index.html` e os dois métodos práticos de substituição.

---

## 🚀 2. Como Publicar no Netlify (Passo a Passo)

### Método Mais Fácil (Netlify Drop - Sem precisar de código):
1. Acesse **[app.netlify.com/drop](https://app.netlify.com/drop)** e faça login na sua conta Netlify.
2. Execute `powershell -ExecutionPolicy Bypass -File .\PREPARAR_PUBLICACAO.ps1` para atualizar a pasta leve de publicação.
3. Arraste somente a pasta **`dist`** para dentro da área de upload do navegador.
4. Pronto! Em poucos segundos o Netlify vai gerar um link público gratuito (ex: `fazenda-rio-acima.netlify.app`).
5. Se você tiver um domínio próprio (ex: `fazendarioacima.com.br`), você pode conectá-lo gratuitamente nas configurações do Netlify.

---

## 📱 3. Como Atualizar o Número de WhatsApp

Abra o arquivo `assets/js/main.js` na linha 8 e altere:
```javascript
const WHATSAPP_NUMBER = ''; // Coloque aqui o DDD + número quando estiver disponível
```

---

## 📍 4. Estrutura do Projeto

- `index.html`: Página principal completa (Hero, Chalés Airbnb, Espaço Gourmet, Casamentos, Baias, Google Maps e Contato).
- `assets/css/style.css`: Estilos visuais elegantes, paleta rústico chic e responsividade para celulares.
- `assets/js/main.js`: Interatividade (troca de fotos, formulário de orçamento no WhatsApp, menu mobile).
- `assets/images/`: Galeria de fotos reais da fazenda e do chalé.
- `netlify.toml`: Configuração otimizada para publicação rápida.
