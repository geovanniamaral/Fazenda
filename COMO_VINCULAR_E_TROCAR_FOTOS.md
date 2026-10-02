# Como organizar e trocar as fotos do site

As imagens que aparecem no site ficam somente dentro de:

`assets/images/site/`

As fotos originais continuam preservadas em `assets/images/`, mas o site não usa diretamente esse arquivo geral. Isso evita que uma foto de paisagem apareça, por engano, como foto de baia ou de evento.

## Pastas por assunto

| Pasta | Conteúdo permitido |
| --- | --- |
| `site/hero/` | Imagem panorâmica do topo do site |
| `site/chales/` | Fachada, quartos, sala, cozinha, varanda e vista da hospedagem |
| `site/espaco-gastronomico/` | Fotos reais do salão, cozinha e área gastronômica |
| `site/eventos/` | Gramado, áreas de cerimônia, confraternizações e ensaios |
| `site/baias/` | Baias, cocheiras, corredores, piquetes e instalações equinas |
| `site/paisagens/` | Sede, montanhas, natureza e pôr do sol |

## Forma mais fácil de trocar uma foto

1. Abra a pasta do assunto correto.
2. Veja qual arquivo representa a posição que deseja alterar.
3. Renomeie a nova foto exatamente com o mesmo nome.
4. Substitua o arquivo existente.
5. Publique novamente o site.

Exemplo: para trocar a imagem principal das baias, substitua:

`assets/images/site/baias/estrutura-baias.jpg`

Não é necessário editar o HTML quando o nome do arquivo é mantido.

## Arquivos usados em cada seção

### Topo

- `hero/fazenda-vista.jpg`

### Chalés / Airbnb

- `chales/fachada.jpg`
- `chales/varanda.jpg`
- `chales/sala.jpg`
- `chales/quarto-casal.jpg`
- `chales/quarto-hospedes.jpg`
- `chales/cozinha.jpg`
- `chales/vista.jpg`

### Espaço gastronômico

- `espaco-gastronomico/fachada-salao.jpg`

Quando houver fotos do interior do salão ou da cozinha profissional, elas devem ser adicionadas somente nesta pasta.

### Eventos

- `eventos/gramado-cerimonias.jpg`
- `eventos/area-confraternizacoes.jpg`
- `eventos/cenario-ensaios.jpg`
- `eventos/fundo-eventos.jpg`

As fotos atuais mostram os espaços disponíveis. Quando houver registros de eventos reais e autorizados, eles poderão substituir essas imagens.

### Baias

- `baias/estrutura-baias.jpg`
- `baias/fachada-baias.jpg`
- `baias/corredor-baias.jpg`
- `baias/silos-e-instalacoes.jpg`

### Paisagens e galeria

- `paisagens/sede-fazenda.jpg`
- `paisagens/lago.jpg`
- `paisagens/por-do-sol.jpg`
- `paisagens/montanhas.jpg`

## Recomendações para novas fotos

- Use JPG ou WebP.
- Prefira fotos horizontais.
- Evite nomes com espaços e acentos.
- Para o site carregar rápido, use até 1600 px de largura e, preferencialmente, menos de 700 KB por imagem.
- Não coloque fotos genéricas em `eventos/` ou `baias/`. A imagem deve mostrar claramente o espaço anunciado.
- Antes de publicar fotos de hóspedes ou participantes de eventos, confirme que existe autorização de uso de imagem.

Se uma nova foto precisar ocupar uma posição adicional, e não apenas substituir uma existente, o `index.html` deverá ser atualizado.
