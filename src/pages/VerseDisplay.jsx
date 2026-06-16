import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

// 📚 BANCO DE DADOS EXPANDIDO — 40 VERSÍCULOS SELECIONADOS
const verseData = {
  proximo: {
    title: "Próximo de Deus",
    verses: [
      { text: "“Permaneçam em mim, e eu permanecerei em vocês. Nenhum ramo pode dar fruto por si mesmo, se não permanecer na videira. Vocês também não podem dar fruto, se não permanecerem em mim.”", ref: "— João 15:4" },
      { text: "“Tu me farás conhecer a vereda da vida, a alegria plena da tua presença e o prazer eterno de estar à tua direita.”", ref: "— Salmos 16:11" },
      { text: "“Aproximem-se de Deus, e ele se aproximará de vocês.”", ref: "— Tiago 4:8" },
      { text: "“Eu sou a videira; vocês são os ramos. Se alguém permanecer em mim e eu nele, esse dá muito fruto; pois sem mim vocês não podem fazer coisa alguma.”", ref: "— João 15:5" },
      { text: "“Pois estou convencido de que nem morte nem vida, nem anjos nem demônios... será capaz de nos separar do amor de Deus que está em Cristo Jesus, nosso Senhor.”", ref: "— Romanos 8:38-39" },
      { text: "“O Senhor é o meu pastor; de nada terei falta. Em verdes pastagens me faz repousar e me conduz a águas tranquilas.”", ref: "— Salmos 23:1-2" },
      { text: "“Deus é amor, e aquele que permanece no amor permanece em Deus, e Deus, nele.”", ref: "— 1 João 4:16" },
      { text: "“Como a corça anseia por águas correntes, a minha alma anseia por ti, ó Deus.”", ref: "— Salmos 42:1" },
      { text: "“O Senhor, o seu Deus, está em seu meio, poderoso para salvar. Ele se alegrará em você com júbilo, renovará você com o seu amor e se regozijará em você com cantos.”", ref: "— Sofonias 3:17" },
      { text: "“Melhor é um dia nos teus átrios do que mil em outro lugar; prefiro ficar à porta da casa do meu Deus a habitar nas tendas dos ímpios.”", ref: "— Salmos 84:10" }
    ]
  },
  distante: {
    title: "Distante",
    verses: [
      { text: "“Por que você está abatida, ó minha alma? Por que se perturba dentro de mim? Ponha a sua esperança em Deus! Pois ainda o louvarei; ele é o meu Salvador e o meu Deus.”", ref: "— Salmos 42:11" },
      { text: "“Vocês me procurarão e me acharão quando me procurarem de todo o coração.”", ref: "— Jeremias 29:13" },
      { text: "“Busquem o Senhor enquanto é possível achá-lo; invoquem-no enquanto ele está perto.”", ref: "— Isaías 55:6" },
      { text: "“Para onde poderia fugir do teu Espírito? Para onde poderia escapar da tua presença? Se eu subir aos céus, lá estás; se eu fizer a minha cama na sepultura, também lá estás.”", ref: "— Salmos 139:7-8" },
      { text: "“Eis que estou à porta e bato. Se alguém ouvir a minha voz e abrir a porta, entrarei e cearei com ele, e ele comigo.”", ref: "— Apocalipse 3:20" },
      { text: "“Sou eu que conheço os planos que tenho para vocês', diz o Senhor, 'planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.”", ref: "— Jeremias 29:11" },
      { text: "“O Senhor não demora em cumprir a sua promessa, como julgam alguns. Pelo contrário, ele é paciente com vocês, não querendo que ninguém se perca.”", ref: "— 2 Pedro 3:9" },
      { text: "“Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.”", ref: "— 1 Pedro 5:7" },
      { text: "“Vejam! O braço do Senhor não é curto demais para salvar, nem o seu ouvido surdo demais para ouvir.”", ref: "— Isaías 59:1" },
      { text: "“Qual de vocês que, possuindo cem ovelhas e perdendo uma delas, não deixa as noventa e nove no campo e vai atrás da ovelha perdida, até encontrá-la?”", ref: "— Lucas 15:4" }
    ]
  },
  reconexar: {
    title: "Tentando se reconectar",
    verses: [
      { text: "“Desde a época dos seus antepassados vocês se desviaram dos meus decretos e não os obedeceram. Voltem para mim, e eu voltarei para vocês”, diz o Senhor dos Exércitos.", ref: "— Malaquias 3:7" },
      { text: "“E, levantando-se, foi para seu pai. Quando ainda estava longe, seu pai o viu, encheu-se de compaixão e, correndo, lançou-se-lhe ao pescoço e o beijou.”", ref: "— Lucas 15:20" },
      { text: "“Conheçamos e prossigamos em conhecer o Senhor. A sua vinda é certa como a alvorada; ele virá a nós como a chuva, como a chuva da primavera que rega a terra.”", ref: "— Oséias 6:3" },
      { text: "“Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça.”", ref: "— 1 João 1:9" },
      { text: "“Agora, porém, declara o Senhor: Voltem-se para mim de todo o coração, com jejum, lamento e pranto. Rasguem o coração, e não as vestes.”", ref: "— Joel 2:12-13" },
      { text: "“Desfiz as suas transgressões como a névoa e os seus pecados como a nuvem. Volte para mim, pois eu o resgatei.”", ref: "— Isaías 44:22" },
      { text: "“Cria em mim, ó Deus, um coração puro e renova dentro de mim um espírito estável.”", ref: "— Salmos 51:10" },
      { text: "“Arrependam-se, pois, e convertam-se, para que sejam apagados os vossos pecados, e venham, assim, tempos de refrigério pela presença do Senhor.”", ref: "— Atos 3:19" },
      { text: "“Lembre-se de onde caiu! Arrependa-se e pratique as obras que praticava no princípio.”", ref: "— Apocalipse 2:5" },
      { text: "“Humilhem-se diante do Senhor, e ele os exaltará.”", ref: "— Tiago 4:10" }
    ]
  },
  ajuda: {
    title: "Preciso de ajuda",
    verses: [
      { text: "“Deus é o nosso refúgio e a nossa fortaleza, auxílio sempre presente na adversidade. Por isso não temeremos, ainda que a terra trema e os montes afundem no coração do mar.”", ref: "— Salmos 46:1-2" },
      { text: "“Não tema, pois estou com você; não tenha medo, pois sou o seu Deus. Eu o fortalecerei e o ajudarei; eu o segurarei com a minha mão direita vitoriosa.”", ref: "— Isaías 41:10" },
      { text: "“Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus. E a paz de Deus guardará o coração de vocês.”", ref: "— Filipenses 4:6-7" },
      { text: "“Elevo os olhos para os montes: de onde me virá o socorro? O meu socorro vem do Senhor, que fez os céus e a terra.”", ref: "— Salmos 121:1-2" },
      { text: "“Mas ele me disse: 'Minha graça é suficiente para você, pois o meu poder se aperfeiçoa na fraqueza'. Portanto, eu me gloriarei ainda mais alegremente em minhas fraquezas.”", ref: "— 2 Coríntios 12:9" },
      { text: "“O Senhor é bom, um refúgio em tempos de angústia. Ele protege os que nele confiam.”", ref: "— Naum 1:7" },
      { text: "“Clamou este pobre, e o Senhor o ouviu; e o livrou de todas as suas angústias.”", ref: "— Salmos 34:6" },
      { text: "“Entregue o seu caminho ao Senhor; confie nele, e ele agirá.”", ref: "— Salmos 37:5" },
      { text: "“Ele dá força ao cansado e aumenta o poder do que está sem forças.”", ref: "— Isaías 40:29" },
      { text: "“Entregue as suas preocupações ao Senhor, e ele o susterá; jamais permitirá que o justo venha a cair.”", ref: "— Salmos 55:22" }
    ]
  }
};

export default function VerseDisplay() {
  const { mood } = useParams();
  
  // Garante compatibilidade caso venha 'reconexao' ou 'reconexar' do link
  const currentMood = mood === 'reconexao' ? 'reconexar' : mood;
  const categoryData = verseData[currentMood] || verseData['proximo'];

  // Estado que armazenará o versículo escolhido no sorteio
  const [selectedVerse, setSelectedVerse] = useState(null);

  useEffect(() => {
    // Lógica do sorteio dinâmico (Roda sempre que o usuário entra ou altera o humor)
    const list = categoryData.verses;
    const randomIndex = Math.floor(Math.random() * list.length);
    setSelectedVerse(list[randomIndex]);
  }, [mood, currentMood]);

  // Evita que a página pisque sem conteúdo enquanto o sorteio é processado no milissegundo inicial
  if (!selectedVerse) return null;

  return (
    <div className="min-h-screen pt-24 px-6 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/src/imagens/imagens/fundoplanta.png')" }}>
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-4xl flex items-start">
        <Link to="/como-voce-esta">
          <motion.div whileHover={{ x: -5 }} className="mr-8 mt-2 cursor-pointer bg-white/50 p-2 rounded-full shadow hover:bg-white transition-colors">
            <ChevronLeft className="w-8 h-8 text-gray-700" />
          </motion.div>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-10 text-center md:text-left">
            {categoryData.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-light mb-6">
            {selectedVerse.text}
          </p>
          <p className="text-lg text-gray-600 font-medium md:text-left text-center">
            {selectedVerse.ref}
          </p>
        </motion.div>
      </div>
    </div>
  );
}