const PAIRS = [
  { id:'hepC-1', textA:'Hepatite C', textB:'Processo infeccioso e inflamatório causado pelo vírus C e que pode se manifestar na forma aguda ou crônica.'},
  { id:'hepC-2', textA:'Etiologia do VHC', textB:'Contato com sangue contaminado; Compartilhamento de objetos cortantes; Uso de materiais não esterilizados; Procedimentos invasivos sem biossegurança; Transmissão de mãe para o filho durante a gestação ou parto.'},
  { id:'hepC-3', textA:'Características Morfológicas do vírus VHC', textB:'Diâmetro entre 55-65nm; Envelope lipídico com glicoproteínas E1 e E2; Núcleo icosaédrico com um genoma de RNA de fita positiva;Partículas virais são heterogêneas, com variações de tamanho, densidade e infectividade.'},
  { id:'hepC-4', textA:'Importância Clínica', textB:'A Hepatite C Crônica não tratada pode levar à cirrose em 20% a 30% dos casos, aumentando o risco de câncer de fígado.'},
  { id:'hepC-5', textA:'Diagnóstico', textB:'Feito por teste rápido anti-HCV ou por doação de sangue. Se positivar, é necessário realizar um exame de carga viral (HCV-RNA).' },
  { id:'hepC-6', textA:'Tratamento', textB:'Feito com antivirais ação direta (DAA). O médico prescreverá o tratamento seguindo as orientações do Protocolo Clínico e Diretrizes Terapêuticas.'},
  { id:'hepC-7', textA:'Epidemiologia da doença', textB:'70% dos casos agudos se tornam crônicos e o risco de desenvolvimento de cirrose varia entre 15% a 30% em 20 anos. O risco anual de descompensação hepática é de 3% a 6%. Após um primeiro episódio de descompensação hepática, o risco de óbito, nos 12 meses seguintes, é de 15% a 20%.'}
];

const boardEl = document.getElementById('board');
const movesEl = document.getElementById('moves');
const restartBtn = document.getElementById('btn-restart');
const pairsCountEl = document.getElementById('pairs-count');
const startModal = document.getElementById('start-modal');
const startBtn = document.getElementById('btn-start');

let deck = [], first = null, second = null, lock = false;
let moves = 0, matched = 0, totalPairs = 0;

function adjustText(el) {
  const parent = el.parentElement;
  let scale = parent.clientWidth / el.scrollWidth;
  el.style.transform = `scale(${Math.min(scale, 1)})`;
}

window.onload = () => {
  document.querySelectorAll('.front .text').forEach(adjustText);
};


function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function buildDeckFromPairs(pairs){
  const cards = [];
  pairs.forEach(p => {
    cards.push({ id:p.id+'-A', pairId:p.id, content:p.textA });
    cards.push({ id:p.id+'-B', pairId:p.id, content:p.textB });
  });
  return shuffle(cards);
}

function createCardEl(card){
  const el = document.createElement('div');
  el.className='card';
  el.dataset.id = card.id;
  el.dataset.pair = card.pairId;

  if (card.id.endsWith('-A')) {
    el.classList.add('typeA');
  }else{
    el.classList.add('typeB');
  }
  

  el.innerHTML = `
    <div class="card-inner">
      <div class="face back">?</div>
      <div class="face front"><div class="text">${card.content}</div></div>
    </div>
  `;

  el.addEventListener('click', () => {
    if (lock || el.classList.contains('flipped') || el.classList.contains('matched')) return;

    el.classList.add('flipped');

    if (!first){
      first = el;
    } else {
      second = el;
      lock = true;
      moves++;
      movesEl.textContent = 'Movimentos: ' + moves;

      if (first.dataset.pair === second.dataset.pair){
        first.classList.add('matched');
        second.classList.add('matched');
        matched++;
        lock = false;
        first = null;
        second = null;

        if (matched === totalPairs){
          stopTimer();
        }
      } else {
        setTimeout(()=>{
          first.classList.remove('flipped');
          second.classList.remove('flipped');
          first=null;
          second=null;
          lock=false;
        },900);
      }
    }
  });

  return el;
}

function startGame(){
  boardEl.innerHTML="";
  moves=0;
  matched=0;
  movesEl.textContent="Movimentos: 0";

  deck = buildDeckFromPairs(PAIRS);
  totalPairs = PAIRS.length;
  pairsCountEl.textContent = totalPairs;

  deck.forEach(card => boardEl.appendChild(createCardEl(card)));
}

startBtn.addEventListener("click", () => {
  startModal.style.animation = "fadeOut .6s forwards";

  setTimeout(()=>{
    startModal.style.display="none";
    startGame();
  },600);
});

// REINICIAR
restartBtn.addEventListener("click", startGame);
