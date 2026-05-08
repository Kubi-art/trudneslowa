// TrudneSlowa.pl - Generator Logic

let selectedSituation = null;
let selectedTone = null;
let selectedRelationship = 'pracownik';

const quickStartTemplates = {
    feedback: [
        { label: "📉 Spadek wydajności", text: "Zauważyłem ostatnio spadek wydajności w realizowanych projektach. Chciałbym omówić przyczyny i wspólnie znaleźć rozwiązanie." },
        { label: "⏰ Częste spóźnienia", text: "Od kilku tygodni obserwuję regularne spóźnienia. To wpływa na pracę zespołu i realizację wspólnych zadań." },
        { label: "🤝 Problemy w komunikacji", text: "Pojawiły się sygnały o trudnościach w komunikacji z zespołem. Chciałbym to przedyskutować i wypracować lepsze rozwiązania." },
        { label: "📊 Nieosiągnięte cele", text: "Cele kwartalne nie zostały zrealizowane zgodnie z planem. Musimy omówić przyczyny i ustalić plan działania." }
    ],
    rozwiazanie: [
        { label: "🔄 Reorganizacja", text: "W związku z restrukturyzacją działu, Twoje stanowisko zostanie zlikwidowane. Chcę omówić warunki rozwiązania umowy." },
        { label: "⚠️ Powtarzające się problemy", text: "Pomimo wcześniejszych rozmów i ostrzeżeń, problemy się powtarzają. Podjąłem decyzję o rozwiązaniu współpracy." },
        { label: "💼 Zmiana strategii", text: "Firma zmienia kierunek działalności, co wymaga znaczących zmian kadrowych. Twoja rola nie jest już zgodna z nową strategią." }
    ],
    odmowa: [
        { label: "📊 Wyniki niewystarczające", text: "Obecne wyniki pracy nie osiągają poziomu wymaganego do awansu na wyższe stanowisko." },
        { label: "💰 Budżet wyczerpany", text: "Budżet na podwyżki w tym kwartale został już w pełni wykorzystany. Możemy wrócić do tej rozmowy w przyszłym okresie." },
        { label: "⏳ Za krótki staż", text: "Staż pracy w firmie jest jeszcze zbyt krótki, aby rozważać awans na to stanowisko." }
    ],
    skarga: [
        { label: "🔍 Weryfikujemy sprawę", text: "Otrzymaliśmy Państwa skargę i traktujemy ją bardzo poważnie. Dokładnie weryfikujemy opisaną sytuację." },
        { label: "🙏 Przepraszamy za błąd", text: "Przepraszamy za niedogodności. To nie powinno mieć miejsca i podejmujemy kroki, aby to naprawić." },
        { label: "📞 Skontaktujemy się", text: "Przekazaliśmy sprawę odpowiedniemu działowi. Skontaktujemy się w ciągu 48h z rozwiązaniem." }
    ],
    uwaga: [
        { label: "🗣️ Nieodpowiedni ton", text: "Ostatnio zaobserwowałem nieodpowiedni ton w rozmowach z klientami. Musimy to zmienić, gdyż wpływa na wizerunek firmy." },
        { label: "⏰ Niepunktualność", text: "Spóźnienia na spotkania zespołu stały się regularne. To brak szacunku dla czasu innych i musi się to zmienić." },
        { label: "📱 Prywatne sprawy w pracy", text: "Zauważam nadmierne zaangażowanie w sprawy prywatne w godzinach pracy. Wpływa to negatywnie na efektywność." }
    ],
    reorganizacja: [
        { label: "🔄 Zmiana struktury", text: "Wprowadzamy zmiany w strukturze organizacyjnej. Dział zostanie podzielony na dwa mniejsze zespoły." },
        { label: "📍 Nowa lokalizacja", text: "W ramach optymalizacji, zespół przeniesie się do nowej lokalizacji. Szczegóły i harmonogram poniżej." },
        { label: "👥 Zmiana przełożonych", text: "Od przyszłego miesiąca dział będzie raportował do nowego managera. Chcę przedstawić zmiany i ich uzasadnienie." }
    ]
};

// Initialize generator if on index page
if (document.getElementById('generatorForm')) {
    initGenerator();
}

function initGenerator() {
    // Situation selection
    document.querySelectorAll('.situation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.situation-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedSituation = this.dataset.situation;
            
            loadQuickStartTags(selectedSituation);
            
            document.getElementById('step2').classList.remove('hidden');
            document.getElementById('step-indicator-2').classList.add('active');
            document.getElementById('step3').classList.remove('hidden');
            document.getElementById('step-indicator-3').classList.add('active');
            document.getElementById('step4').classList.remove('hidden');
            
            updateButton();
        });
    });

    // Context textarea validation
    const contextField = document.getElementById('context');
    if (contextField) {
        contextField.addEventListener('input', updateButton);
    }

    // Tone selection
    document.querySelectorAll('.tone-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedTone = this.dataset.tone;
            updateButton();
        });
    });

    // Relationship selection
    const relationshipField = document.getElementById('relationship');
    if (relationshipField) {
        relationshipField.addEventListener('change', function() {
            selectedRelationship = this.value;
        });
    }

    // Form submission
    document.getElementById('generatorForm').addEventListener('submit', handleFormSubmit);
}

function loadQuickStartTags(situation) {
    const container = document.getElementById('quickStartTags');
    if (!container) return;
    
    const templates = quickStartTemplates[situation] || [];
    
    container.innerHTML = templates.map(template => 
        `<button type="button" class="quick-tag" data-text="${template.text}">${template.label}</button>`
    ).join('');

    container.querySelectorAll('.quick-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const textarea = document.getElementById('context');
            const currentValue = textarea.value.trim();
            const newText = this.dataset.text;
            
            // Append instead of replace
            if (currentValue) {
                textarea.value = currentValue + ' ' + newText;
            } else {
                textarea.value = newText;
            }
            
            textarea.focus();
            updateButton();
        });
    });
}

function updateButton() {
    const btn = document.getElementById('generateBtn');
    if (!btn) return;
    
    const contextValue = document.getElementById('context').value.trim();
    const hasMinLength = contextValue.length >= 5;
    
    btn.disabled = !(selectedSituation && selectedTone && hasMinLength);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const context = document.getElementById('context').value;
    const btn = document.getElementById('generateBtn');
    const btnText = btn.querySelector('.btn-text');
    
    btn.disabled = true;
    btn.classList.add('loading');
    btnText.textContent = 'Generuję...';
    
    try {
        // Simulate API call (replace with real API endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Demo result
        const demoResult = generateDemoMessage(selectedSituation, context, selectedTone);
        
        document.getElementById('result1').textContent = demoResult;
        document.getElementById('results').classList.add('show');
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert('Wystąpił błąd. Spróbuj ponownie za moment.');
        console.error('Error:', error);
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
        btnText.textContent = 'Wygeneruj komunikat';
    }
}

function generateDemoMessage(situation, context, tone) {
    const messages = {
        feedback: "Szanowny Panie/Pani, chciałbym porozmawiać o kilku aspektach Pani/Pana pracy. Zauważyłem ostatnio pewne obszary, które wymagają poprawy. Jestem przekonany, że wspólnie możemy wypracować rozwiązania, które pozwolą na osiągnięcie lepszych wyników.",
        rozwiazanie: "Szanowny Panie/Pani, po głębokiej analizie sytuacji w firmie podjąłem trudną decyzję o rozwiązaniu współpracy. Chciałbym omówić szczegóły i warunki zakończenia zatrudnienia w sposób profesjonalny i z pełnym szacunkiem.",
        odmowa: "Dziękuję za wyrażenie zainteresowania awansem. Po przeanalizowaniu Pana/Pani wniosku oraz obecnej sytuacji w firmie, z przykrością informuję, że w tym momencie nie możemy pozytywnie rozpatrzyć tej prośby. Chętnie omówię perspektywy rozwoju w przyszłości.",
        skarga: "Dziękujemy za zgłoszenie. Traktujemy Państwa sprawę z pełną powagą i przepraszamy za niedogodności. Dokładnie weryfikujemy opisaną sytuację i skontaktujemy się z rozwiązaniem w ciągu 48 godzin.",
        uwaga: "Chciałbym zwrócić uwagę na kwestię, którą zaobserwowałem ostatnio. Jest to ważne dla dalszej współpracy i profesjonalizmu naszego zespołu. Liczę na zrozumienie i zmianę podejścia.",
        reorganizacja: "Szanowni Państwo, informuję o planowanych zmianach organizacyjnych w naszym dziale. Zmiany te są częścią strategii rozwoju firmy i dotyczą struktury oraz zakresu obowiązków. Szczegóły przedstawię na spotkaniu zespołu."
    };
    
    return messages[situation] || "Wygenerowana wiadomość pojawi się tutaj.";
}

function copyText(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Skopiowano do schowka!');
    }).catch(err => {
        console.error('Błąd kopiowania:', err);
    });
}

// Contact form handler
if (document.getElementById('contactForm')) {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Dziękujemy za wiadomość! Skontaktujemy się w ciągu 24h.');
        this.reset();
    });
}
