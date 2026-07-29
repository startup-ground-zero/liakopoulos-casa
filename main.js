/* ===================================
   LIAKOPOULOS CASA - Main JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // === Loader ===
    const loader = document.getElementById('loader');
    
    function hideLoader() {
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            initAnimations();
        }
    }

    // Hide loader after animation OR after 3s max (failsafe)
    window.addEventListener('load', () => {
        setTimeout(hideLoader, 2200);
    });

    // Fallback if load event already fired
    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 2200);
    }
    
    // Absolute failsafe — never block navigation for more than 3.5s
    setTimeout(hideLoader, 3500);

    // If no loader exists (sub-pages), init animations immediately
    if (!loader) {
        initAnimations();
    }

    // === Custom Cursor ===
    const cursor = document.getElementById('cursor');
    const cursorDot = cursor?.querySelector('.cursor-dot');
    const cursorRing = cursor?.querySelector('.cursor-ring');
    
    if (cursor && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Smooth follow for dot
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            
            // Even smoother for ring
            ringX += (mouseX - ringX) * 0.1;
            ringY += (mouseY - ringY) * 0.1;

            if (cursorDot) {
                cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            }
            if (cursorRing) {
                cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            }

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover states
        const hoverElements = document.querySelectorAll('a, button, .category-card, .inspiration-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }

    // === Header Scroll Effect ===
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    const headerStartsScrolled = header && header.classList.contains('scrolled');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else if (!headerStartsScrolled) {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (backToTop) {
            if (currentScroll > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        lastScroll = currentScroll;
    });

    // === Mobile Menu ===
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // === Horizontal Scroll for Categories ===
    const categoriesScroll = document.querySelector('.categories-scroll');
    if (categoriesScroll) {
        let isDown = false;
        let startX;
        let scrollLeft;

        categoriesScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - categoriesScroll.offsetLeft;
            scrollLeft = categoriesScroll.scrollLeft;
        });

        categoriesScroll.addEventListener('mouseleave', () => {
            isDown = false;
        });

        categoriesScroll.addEventListener('mouseup', () => {
            isDown = false;
        });

        categoriesScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - categoriesScroll.offsetLeft;
            const walk = (x - startX) * 2;
            categoriesScroll.scrollLeft = scrollLeft - walk;
        });

        // Mouse wheel horizontal scroll (non-blocking — page still scrolls vertically)
        categoriesScroll.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                categoriesScroll.scrollLeft += e.deltaY;
            }
        }, { passive: true });
    }

    // === Counter Animation ===
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        counters.forEach(counter => {
            if (counter.dataset.animated) return;
            
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * easeOut);
                
                counter.textContent = current.toLocaleString('el-GR');
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString('el-GR');
                }
            }
            
            counter.dataset.animated = 'true';
            requestAnimationFrame(updateCounter);
        });
    }

    // === Intersection Observer for Animations ===
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger counter animation
                    if (entry.target.closest('.stats-section')) {
                        animateCounters();
                    }
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .stagger-children, .img-reveal').forEach(el => {
            observer.observe(el);
        });

        // Observe stats section
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    // === Smooth scroll for anchor links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // === Parallax on Scroll ===
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const rect = el.getBoundingClientRect();
                const offsetTop = rect.top + scrollY;
                
                if (scrollY + window.innerHeight > offsetTop && scrollY < offsetTop + rect.height) {
                    const yPos = (scrollY - offsetTop) * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                }
            });
        });
    }

    // === Scroll Progress Bar ===
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    // === Cookie Consent Banner ===
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 2500);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
            cookieBanner.classList.add('hidden');
            // Enable GA4 tracking
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
            }
        });
    }

    if (cookieDecline) {
        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
            cookieBanner.classList.add('hidden');
        });
    }

    // === Contact Form Submission ===
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            submitText.textContent = 'Αποστολή...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://formspree.io/f/info@liakopoulos-casa.gr', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    submitText.textContent = 'Εστάλη ✓';
                    submitBtn.style.background = '#2ecc71';
                    contactForm.reset();
                    setTimeout(() => {
                        submitText.textContent = 'Αποστολή';
                        submitBtn.style.background = '';
                        submitBtn.style.opacity = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    // Fallback: open mailto
                    const name = formData.get('name') || '';
                    const email = formData.get('email') || '';
                    const phone = formData.get('phone') || '';
                    const message = formData.get('message') || '';
                    const subject = `Μήνυμα από ${name} - Liakopoulos Casa`;
                    const body = `Όνομα: ${name}%0AEmail: ${email}%0AΤηλέφωνο: ${phone}%0A%0A${message}`;
                    window.location.href = `mailto:info@liakopoulos-casa.gr?subject=${encodeURIComponent(subject)}&body=${body}`;
                    submitText.textContent = 'Εστάλη ✓';
                    setTimeout(() => {
                        submitText.textContent = 'Αποστολή';
                        submitBtn.style.opacity = '';
                        submitBtn.disabled = false;
                    }, 3000);
                }
            } catch (err) {
                // Fallback to mailto
                const name = formData.get('name') || '';
                const email = formData.get('email') || '';
                const phone = formData.get('phone') || '';
                const message = formData.get('message') || '';
                const subject = `Μήνυμα από ${name} - Liakopoulos Casa`;
                const body = `Όνομα: ${name}%0AEmail: ${email}%0AΤηλέφωνο: ${phone}%0A%0A${message}`;
                window.location.href = `mailto:info@liakopoulos-casa.gr?subject=${encodeURIComponent(subject)}&body=${body}`;
                submitText.textContent = 'Εστάλη ✓';
                setTimeout(() => {
                    submitText.textContent = 'Αποστολή';
                    submitBtn.style.opacity = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    // === Category Popup ===
    const categoryData = {
        sidirika: { title: 'Σιδηρικά', items: ['Κλειδαριές', 'Κύλινδροι ασφαλείας', 'Σούστες πόρτας', 'Μεντεσέδες', 'Γωνίες στήριξης', 'Βάσεις χαγιατιών', 'Κατσαβίδια', 'Βίδες', 'Πρόκες', 'Βύσματα (μπετόν, γυψοσανίδας, τούβλου κ.λπ.)', 'Αντικλείδια', 'Λουκέτα', 'Σύρτες', 'Πένσες', 'Γκαζοτανάλιες', 'Μυτοτσίμπιδα', 'Δεματικά / Tire ups', 'Σύρματα', 'Σίτες (fiberglass, αλουμινίου, pet)', 'Κουνελόπλεγμα', 'Αλυσίδες', 'Σχοινιά', 'Αερόπλαστ', 'Αεροχάρτ', 'Δίχτυ σκίασης', 'Νάιλον επικάλυψης', 'Δίχτυα μπαλκονιών', 'Χρηματοκιβώτια', 'Μηχανισμοί συρταριών', 'Πιατοθήκες', 'Κουταλοθήκες', 'Πάτοι κουζίνας / Νεροσυλλέκτες', 'Λάστιχα κήπου', 'Συστήματα ποτίσματος', '...και άλλα πολλά'] },
        xromata: { title: 'Χρώματα', items: ['Πλαστικά', 'Ακρυλικά', 'Μονωτικά τοίχου', 'Μονωτικά ταράτσας', 'Αστάρια νερού / διαλυτικού / χαλαζιακά', 'Βερνίκια εμποτισμού εξωτερικής χρήσης', 'Βερνίκια επικάλυψης νερού', 'Λαδομπογιές σιδήρου / ξύλου', 'Λαδομπογιές 3σε1', 'Λαδομπογιές νερού', 'Σπρέι χρωμάτων', 'WD-40', 'Αφροί πολυουρεθάνης', 'Μαστίχες στεγανοποίησης', 'Polymax', 'Σιλικόνες', 'Χρώματα διαγράμμισης', 'Χρώματα πισίνας', 'Χρώματα μεταλιζέ / γραφίτες', 'Κόλλες πλακιδίων', 'Σοβάδες', 'Παρεντίνες', 'Ταινίες στεγανοποίησης αλουμινίου', 'Πιστόλια σιλικόνης', '...και άλλα πολλά'] },
        diakosmitika: { title: 'Διακοσμητικά', items: ['Πόμολα', 'Λαβές εξώθυρας', 'Λαβές ντουλάπας', 'Πομολάκια ντουλάπας', 'Αριθμοί κατοικιών', 'Γραμματοκιβώτια', 'Μαγνήτες πορτών', 'Συστήματα σκίασης (ρόλερ, στόρια, κάθετες περσίδες)', 'Στόρια ξύλινα και αλουμινίου', 'Συρτές διακοσμητικοί', 'Πάνελ τοίχου', 'Σανίδες WPC', 'Κουρτινόβεργες', 'Σιδηρόδρομοι κουρτίνας', 'Κρεμάστρες', 'Αξεσουάρ τζακιού', '...και άλλα πολλά'] },
        mpanio: { title: 'Μπάνιο', items: ['Πλακίδια', 'Έπιπλα', 'Καθρέφτες', 'Είδη υγιεινής', 'Νιπτήρες', 'Καμπίνες', 'Μπαταρίες', 'Αξεσουάρ (χαρτοθήκες, πετσετοκρεμάστρες, dispenser, ποτηροθήκες)', 'Σπιράλ', 'Τηλέφωνα', 'Πιγκάλ', 'Κάδοι', '...και άλλα πολλά'] }
    };

    const popup = document.getElementById('categoryPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupList = document.getElementById('popupList');
    const popupClose = document.getElementById('popupClose');

    document.querySelectorAll('.category-card[data-category]').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.category;
            const data = categoryData[key];
            if (!data || !popup) return;

            popupTitle.textContent = data.title;
            popupList.innerHTML = data.items.map(item => `<li>${item}</li>`).join('');
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (popupClose) {
        popupClose.addEventListener('click', () => {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // === Search Functionality ===
    const searchToggle = document.getElementById('searchToggle');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Build search index from category data
    const searchIndex = [];
    Object.keys(categoryData).forEach(key => {
        const cat = categoryData[key];
        // Add main category
        searchIndex.push({ name: cat.title, parent: '', category: key });
        // Add all subcategories
        cat.items.forEach(item => {
            if (item !== '...και άλλα πολλά') {
                searchIndex.push({ name: item, parent: cat.title, category: key });
            }
        });
    });

    if (searchToggle && searchBox) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            searchBox.classList.toggle('active');
            if (searchBox.classList.contains('active')) {
                searchInput.focus();
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-search')) {
                searchBox.classList.remove('active');
            }
        });

        // Remove accents for accent-insensitive search
        function removeAccents(str) {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }

        searchInput.addEventListener('input', () => {
            const query = removeAccents(searchInput.value.trim().toLowerCase());
            searchResults.innerHTML = '';

            if (query.length < 2) return;

            const matches = searchIndex.filter(c =>
                removeAccents(c.name.toLowerCase()).includes(query)
            ).slice(0, 10);

            if (matches.length === 0) {
                searchResults.innerHTML = '<div class="search-no-results">Δεν βρέθηκαν αποτελέσματα</div>';
                return;
            }

            matches.forEach(item => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.textContent = item.parent ? `${item.name} → ${item.parent}` : item.name;
                div.addEventListener('click', () => {
                    // Open the popup for this category
                    const data = categoryData[item.category];
                    if (data && popup) {
                        popupTitle.textContent = data.title;
                        popupList.innerHTML = data.items.map(i => `<li>${i}</li>`).join('');
                        popup.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                    searchBox.classList.remove('active');
                    searchInput.value = '';
                });
                searchResults.appendChild(div);
            });
        });
    }
});
