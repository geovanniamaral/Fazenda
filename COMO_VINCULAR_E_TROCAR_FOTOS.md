# Como organizar e trocar as fotos do site

As imagens que aparecem no site ficam somente dentro de:

`assets/images/site/`

Não edite `dist/assets/images/site/` diretamente. A pasta `dist` é uma cópia otimizada para publicação e é recriada do zero pelo script. As fotos originais permanecem preservadas em `assets/images/site/`.

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

## Forma mais fácil de trocar ou acrescentar fotos

1. Abra a pasta do assunto correto.
2. Para trocar uma foto, substitua o arquivo mantendo o mesmo nome.
3. Para acrescentar uma foto, copie o novo arquivo para a pasta. Use um nome sem espaços e sem acentos.
4. Execute `powershell -ExecutionPolicy Bypass -File .\PREPARAR_PUBLICACAO.ps1`.
5. Publique novamente a pasta `dist`.

Para visualizar antes de publicar, dê dois cliques em `VISUALIZAR_SITE.bat`. O catálogo será atualizado, o site abrirá no navegador e nada será enviado para a internet.

Para centralizar todas as tarefas, use `MANUTENCAO_SITE.bat`. O menu abre a pasta correta de cada seção, permite visualizar, publicar ou acessar a sincronização com o GitHub.

Exemplo: para trocar a imagem principal das baias, substitua:

`assets/images/site/baias/estrutura-baias.jpg`

Não é necessário editar o HTML. O script atualiza `assets/js/photo-catalog.js`, e cada foto aparece automaticamente na seção correspondente e na galeria geral.

Uma foto nova pode ter qualquer nome sem espaços ou acentos. Para definir facilmente a imagem principal dos chalés ou do espaço gastronômico, comece o nome com `00-capa`, por exemplo `00-capa-chale.webp`.

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

Arquivos novos são incluídos automaticamente. O site aceita JPG, JPEG, PNG, WebP e AVIF; outros arquivos colocados nas pastas são ignorados.
