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
                const response = await fetch('https://formspree.io/f/xwvgzeln', {
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

    // === Category Popup & i18n Translations ===
    const translations = {
        el: {
            meta_title: "Liakopoulos Casa | Χρώματα, Εργαλεία, Πλακάκια, Διακόσμηση στο Ρίο Πατρών",
            meta_desc: "Liakopoulos Casa - Υλικά σπιτιού, χρώματα, εργαλεία, πλακάκια, ταπετσαρίες, κουρτίνες, τζάκια, κήπος και διακόσμηση. Οικογενειακή επιχείρηση με πανελλαδική φήμη από το 1975 στο Ρίο Πατρών.",
            nav_home: "Αρχική",
            nav_categories: "Κατηγορίες",
            nav_inspiration: "Έμπνευση",
            nav_story: "Η Ιστορία μας",
            nav_contact: "Επικοινωνία",
            search_aria: "Αναζήτηση",
            search_placeholder: "Αναζήτηση κατηγορίας...",
            search_no_results: "Δεν βρέθηκαν αποτελέσματα",
            hero_tagline: "Από το 1975 — Οικογενειακή Παράδοση",
            hero_title_1: "Δημιουργούμε",
            hero_title_2: "χώρους που",
            hero_title_3: "εμπνέουν",
            hero_desc: "Υλικά & ιδέες για κάθε χώρο",
            hero_btn_explore: "Εξερευνήστε",
            hero_btn_story: "Η Ιστορία μας",
            hero_scroll: "Scroll",
            marquee_building: "Υλικά Οικοδομής",
            marquee_tools: "Εργαλεία",
            marquee_paints: "Χρώματα",
            marquee_handles: "Πόμολα",
            marquee_locks: "Κλειδαριές",
            marquee_faucets: "Μπαταρίες",
            marquee_curtain_rods: "Κουρτινόβεργες",
            marquee_wallpapers: "Ταπετσαρίες",
            marquee_bathroom_acc: "Αξεσουάρ Μπάνιου",
            marquee_garden_sheds: "Αποθήκες Κήπου",
            cat_section_label: "01 / Κατηγορίες",
            cat_section_title: "Ό,τι χρειάζεται<br>το σπίτι σας",
            cat_1_title: "Σιδηρικά",
            cat_1_desc: "Εργαλεία, υλικά, βίδες, κόλλες",
            cat_2_title: "Χρώματα",
            cat_2_desc: "Πάνω από 10.000 αποχρώσεις",
            cat_3_title: "Διακοσμητικά",
            cat_3_desc: "Ταπετσαρίες, πέτρες, κουρτίνες",
            cat_4_title: "Μπάνιο",
            cat_4_desc: "Αξεσουάρ, μπαταρίες, καθρέφτες",
            popup_contact_btn: "Επικοινωνήστε μαζί μας",
            why_label: "02 / Γιατί εμάς",
            why_title: "50 χρόνια<br>εμπιστοσύνης",
            why_desc: "Από το 1975, η οικογένεια Λιακόπουλος προσφέρει ποιότητα, εξυπηρέτηση και τεχνογνωσία σε χιλιάδες πελάτες σε όλη την Ελλάδα.",
            why_btn: "Η Ιστορία μας",
            feature_1_title: "Τεράστια Γκάμα Προϊόντων",
            feature_1_desc: "Πάνω από 8.500 κωδικοί σε αποθήκη, έτοιμοι για παράδοση",
            feature_2_title: "Εξειδικευμένο Προσωπικό",
            feature_2_desc: "Συμβουλές από επαγγελματίες με πολυετή εμπειρία",
            feature_3_title: "Showroom Εμπειρίας",
            feature_3_desc: "Παρουσίαση χρωμάτων, πλακιδίων & ταπετσαριών",
            feature_4_title: "Παράδοση σε Όλη την Ελλάδα",
            feature_4_desc: "Αποστολή σε 1-3 εργάσιμες ημέρες, παντού",
            insp_label: "03 / Έμπνευση",
            insp_title: "Ιδέες για<br>τον χώρο σας",
            insp_desc: "Ανακαλύψτε τάσεις, συνδυασμούς και λύσεις",
            insp_tag_1: "Τάσεις 2025",
            insp_title_1: "Χρώματα που μεταμορφώνουν",
            insp_desc_1: "Οι αποχρώσεις που κυριαρχούν στη διακόσμηση",
            insp_tag_2: "Κήπος",
            insp_title_2: "Ο τέλειος κήπος",
            insp_tag_3: "Μπάνιο",
            insp_title_3: "Μοντέρνο μπάνιο",
            insp_tag_4: "Διακόσμηση",
            insp_title_4: "Ταπετσαρίες & διακόσμηση",
            insp_more: "Περισσότερες ιδέες",
            stat_1_label: "Χρόνια Εμπειρίας",
            stat_2_label: "Προϊόντα σε Stock",
            stat_3_label: "Επώνυμες Εταιρείες",
            stat_4_label: "Ευχαριστημένοι Πελάτες",
            insta_label: "04 / Ακολουθήστε μας",
            insta_desc: "Καθημερινή έμπνευση στο Instagram",
            insta_btn: "Ακολουθήστε μας",
            reviews_label: "05 / Αξιολογήσεις",
            reviews_title: "Τι λένε οι<br>πελάτες μας",
            reviews_desc: "Αξιολογήσεις από πελάτες στο Google",
            reviews_count: "Βασισμένο σε 150+ αξιολογήσεις Google",
            review_1_name: "Μαρία Κ.",
            review_1_text: "Εξαιρετικό κατάστημα με τεράστια ποικιλία χρωμάτων. Το προσωπικό με βοήθησε να επιλέξω τις ιδανικές αποχρώσεις για το σαλόνι μου. Σίγουρα θα ξαναέρθω!",
            review_1_date: "πριν 2 εβδομάδες",
            review_2_name: "Γιώργος Π.",
            review_2_text: "Τα πάντα για το σπίτι σε ένα μέρος. Βρήκα πλακάκια, χρώματα και εργαλεία σε εξαιρετικές τιμές. Η εξυπηρέτηση είναι κορυφαία — σε καθοδηγούν σωστά.",
            review_2_date: "πριν 1 μήνα",
            review_3_name: "Αντώνης Δ.",
            review_3_text: "Οικογενειακή επιχείρηση με ήθος. Ανακαίνισα ολόκληρο το σπίτι παίρνοντας τα πάντα από εδώ. Ποιότητα, τιμές και εξυπηρέτηση — 10/10.",
            review_3_date: "πριν 3 εβδομάδες",
            reviews_cta: "Δείτε όλες τις αξιολογήσεις στο Google",
            cookie_text: "Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας στο site μας. Συνεχίζοντας, συμφωνείτε με τη χρήση cookies σύμφωνα με την <a href=\"#\" style=\"text-decoration: underline;\">Πολιτική Απορρήτου</a>.",
            cookie_accept: "Αποδοχή",
            cookie_decline: "Απόρριψη",
            footer_nav_title: "Πλοήγηση",
            footer_cat_title: "Κατηγορίες",
            footer_contact_title: "Επικοινωνία",
            footer_tagline: "Το σπίτι της ποιότητας, από το 1975",
            footer_address: "Χρήστου Παναγόπουλου 5, Ρίο, Πάτρα",
            footer_rights: "© 2025 Liakopoulos Casa. Με επιφύλαξη παντός δικαιώματος.",
            mobile_call: "Καλέστε μας",
            mobile_directions: "Οδηγίες",
            // Contact Page
            contact_page_label: "Επικοινωνία",
            contact_hero_title: "Σας περιμένουμε",
            contact_hero_desc: "Ελάτε να εξερευνήσουμε μαζί τις λύσεις για τον χώρο σας",
            contact_visit_title: "Επισκεφθείτε μας",
            contact_address_label: "Διεύθυνση",
            contact_address_val: "Χρήστου Παναγόπουλου 5<br>Ρίο, 265 04, Πάτρα",
            contact_phone_label: "Τηλέφωνο",
            contact_hours_label: "Ωράριο",
            contact_hours_val: "Δευ - Παρ: 08:00 - 20:00<br>Σάββατο: 08:00 - 15:00<br><span style=\"color: rgba(255,255,255,0.4);\">Κυριακή: Κλειστά</span>",
            contact_parking_title: "Δωρεάν Parking",
            contact_parking_desc: "Ιδιωτικός χώρος στάθμευσης ακριβώς δίπλα στο κατάστημά μας. Εύκολη πρόσβαση από τον κεντρικό δρόμο.",
            form_title: "Στείλτε μας μήνυμα",
            form_subtitle: "Θα σας απαντήσουμε εντός 24 ωρών",
            form_name: "Όνομα *",
            form_phone: "Τηλέφωνο",
            form_email: "Email *",
            form_message: "Μήνυμα *",
            form_submit: "Αποστολή",
            // Categories Page
            cat_page_label: "Κατηγορίες",
            cat_page_title: "Ό,τι χρειάζεται<br>το σπίτι σας",
            cat_page_desc: "Ανακαλύψτε τη γκάμα προϊόντων μας — από χρώματα και πλακάκια μέχρι κήπο και διακόσμηση",
            grid_building_title: "Υλικά Οικοδομής",
            grid_building_desc: "Τσιμέντα, κόλλες, σοβάδες, μονωτικά",
            grid_tools_title: "Εργαλεία",
            grid_tools_desc: "Επαγγελματικά & οικιακά εργαλεία κορυφαίων μαρκών",
            grid_paint_title: "Χρώματα",
            grid_paint_desc: "Πάνω από 10.000 αποχρώσεις, εσωτερικά & εξωτερικά",
            grid_handles_title: "Πόμολα",
            grid_handles_desc: "Πόρτες, παράθυρα, έπιπλα — κλασικά & μοντέρνα",
            grid_locks_title: "Κλειδαριές & Κύλινδροι Ασφαλείας",
            grid_locks_desc: "Αδιαπέραστοι κύλινδροι, κλειδαριές ασφαλείας",
            grid_bath_title: "Αξεσουάρ Μπάνιου",
            grid_bath_desc: "Πετσετοθήκες, ράφια, καθρέφτες, dispenser",
            grid_kitchen_title: "Αξεσουάρ Κουζίνας",
            grid_kitchen_desc: "Οργάνωση, αξεσουάρ ντουλαπιών, καλάθια",
            grid_faucets_title: "Μπαταρίες Μπάνιου & Κουζίνας",
            grid_faucets_desc: "Μπαταρίες νιπτήρα, νεροχύτη, μπανιέρας",
            grid_curtains_title: "Κουρτινόβεργες, Ρόλλερ, Ρόμαν",
            grid_curtains_desc: "Στόρια, πάνελ, μηχανισμοί",
            grid_mailboxes_title: "Γραμματοκιβώτια",
            grid_mailboxes_desc: "Inox, αλουμινίου, κλασικά & μοντέρνα",
            grid_wallpaper_title: "Ταπετσαρίες Τοίχου",
            grid_wallpaper_desc: "Μοντέρνα & κλασικά σχέδια για κάθε χώρο",
            grid_stones_title: "Διακοσμητικές Πέτρες Επένδυσης",
            grid_stones_desc: "Πέτρες τοίχων, εσωτερικά & εξωτερικά",
            grid_storage_title: "Ντουλάπες Οργάνωσης & Αποθήκευσης",
            grid_storage_desc: "Ντουλάπες, ράφια, κουτιά αποθήκευσης",
            grid_garden_title: "Αποθήκες Κήπου",
            grid_garden_desc: "Πλαστικές & μεταλλικές αποθήκες",
            grid_fences_title: "Ξύλινες Περιφράξεις Κήπου",
            grid_fences_desc: "Φράχτες, παραβάν, διαχωριστικά",
            brands_label: "Συνεργασίες",
            brands_title: "Μάρκες που<br>εμπιστευόμαστε",
            cat_cta_title: "Δεν βρίσκετε<br>κάτι;",
            cat_cta_desc: "Επικοινωνήστε μαζί μας — αν δεν το έχουμε, θα το βρούμε για εσάς",
            // Inspiration Page
            insp_page_label: "Έμπνευση",
            insp_page_title: "Ιδέες που<br>ζωντανεύουν",
            insp_page_desc: "Ανακαλύψτε τάσεις, συνδυασμούς χρωμάτων, υλικών και λύσεις διακόσμησης από τους ειδικούς μας",
            insp_art1_label: "Χρώματα 2025",
            insp_art1_title: "Οι αποχρώσεις που θα κυριαρχήσουν",
            insp_art1_desc: "Η φύση εμπνέει τις κυρίαρχες αποχρώσεις: γήινα χρώματα, ζεστά terracotta, βαθιά πράσινα και γαλήνια blues. Ανακαλύψτε πώς να τα εντάξετε στον χώρο σας με ισορροπία και στυλ.",
            insp_color_1: "Terracotta Warmth",
            insp_color_2: "Deep Forest Green",
            insp_color_3: "Serene Blue",
            insp_color_4: "Warm Vanilla",
            insp_art2_label: "Κήπος",
            insp_art2_title: "Δημιουργήστε τον δικό σας παράδεισο",
            insp_art2_desc: "Μετατρέψτε τον εξωτερικό σας χώρο σε μια όαση χαλάρωσης. Από αρδευτικά συστήματα μέχρι διακοσμητικά στοιχεία, γλάστρες και φωτισμό — έχουμε ό,τι χρειάζεστε.",
            insp_tag_irrigation: "Αρδευτικά",
            insp_tag_pots: "Γλάστρες",
            insp_tag_lighting: "Φωτισμός",
            insp_tag_furniture: "Έπιπλα Κήπου",
            insp_art3_label: "Μπάνιο",
            insp_art3_title: "Το Μπάνιο",
            insp_art3_desc: "Μπαταρίες premium ποιότητας, πλακάκια μεγάλων διαστάσεων, ντουζιέρες walk-in. Δημιουργήστε ένα μπάνιο που εμπνέει χαλάρωση και πολυτέλεια.",
            insp_art4_label: "Τζάκι",
            insp_art4_title: "Η ζεστασιά του τζακιού",
            insp_art4_desc: "Ένα τζάκι δεν είναι μόνο πηγή θέρμανσης — είναι η καρδιά του σπιτιού. Ενεργειακά τζάκια, μοντέρνες σόμπες πέλλετ, και αξεσουάρ που συνδυάζουν λειτουργικότητα με αισθητική.",
            tips_label: "Συμβουλές",
            tips_title: "Tips από τους<br>ειδικούς μας",
            tip_1_title: "Δοκιμάστε πρώτα",
            tip_1_desc: "Πάντα δοκιμάζετε το χρώμα σε μικρή επιφάνεια. Η φωτεινότητα του χώρου αλλάζει δραματικά την απόχρωση.",
            tip_2_title: "Σκεφτείτε μακροπρόθεσμα",
            tip_2_desc: "Επενδύστε σε ποιοτικά υλικά. Ένα καλό πλακάκι ή ένα ποιοτικό χρώμα αντέχει χρόνια.",
            tip_3_title: "Ρωτήστε τους ειδικούς",
            tip_3_desc: "Μη διστάζετε να ρωτήσετε. Η ομάδα μας είναι εδώ για να σας καθοδηγήσει σε κάθε επιλογή.",
            cta_help_title: "Χρειάζεστε<br>βοήθεια;",
            cta_help_desc: "Οι ειδικοί μας θα σας βοηθήσουν να βρείτε τις ιδανικές λύσεις",
            // Story Page
            story_page_label: "Η Ιστορία μας",
            story_hero_title: "Μια οικογένεια,<br>ένα πάθος",
            story_hero_desc: "Από μια μικρή αποθήκη υλικών στο ξεκίνημα, σε ένα σημείο αναφοράς για χιλιάδες σπίτια σε όλη την Ελλάδα",
            story_owner_label: "Ιδιοκτήτης",
            story_owner_name: "Ορέστης Λιακόπουλος",
            story_owner_p1: "Το Liakopoulos Casa ιδρύθηκε το 1975 στο Ρίο Πατρών από τον πατέρα του Ορέστη, με όραμα να δημιουργήσει ένα κατάστημα που θα προσφέρει ολοκληρωμένες λύσεις για κάθε σπίτι. Σήμερα, ο Ορέστης συνεχίζει την οικογενειακή παράδοση με πάθος για την ποιότητα και αφοσίωση στην εξυπηρέτηση.",
            story_owner_p2: "Με 50 χρόνια εμπειρίας, γνώση της αγοράς και προσωπική σχέση με κάθε πελάτη, ο Ορέστης και η οικογένειά του συνεχίζουν να εξελίσσουν το κατάστημα, προσφέροντας πάντα τα καλύτερα προϊόντα στις πιο ανταγωνιστικές τιμές.",
            val_1_title: "Πάθος",
            val_1_desc: "Αγαπάμε αυτό που κάνουμε. Κάθε προϊόν επιλέγεται με φροντίδα και γνώση.",
            val_2_title: "Εμπιστοσύνη",
            val_2_desc: "50 χρόνια εμπιστοσύνης από χιλιάδες πελάτες.",
            val_3_title: "Εξέλιξη",
            val_3_desc: "Συνεχής ανανέωση, νέα προϊόντα και τάσεις από όλο τον κόσμο.",
            time_1_title: "Η Αρχή",
            time_1_desc: "Η οικογένεια Λιακόπουλος ξεκινά με ένα μικρό κατάστημα υλικών στην γειτονιά. Με σκληρή δουλειά και αφοσίωση, θέτει τα θεμέλια αυτού που θα γίνει σημείο αναφοράς για χιλιάδες σπίτια.",
            time_2_title: "Ανάπτυξη & Εξέλιξη",
            time_2_desc: "Το κατάστημα μεγαλώνει. Νέες κατηγορίες προϊόντων εμπλουτίζουν τη γκάμα: χρώματα, πλακάκια, ταπετσαρίες, είδη κήπου. Η φήμη εξαπλώνεται πέρα από τα τοπικά σύνορα.",
            time_3_title: "Η Νέα Γενιά",
            time_3_desc: "Η δεύτερη γενιά αναλαμβάνει, φέρνοντας φρέσκες ιδέες και σύγχρονη αντίληψη. Νέες συνεργασίες με κορυφαίες ευρωπαϊκές μάρκες και δημιουργία showroom εμπειρίας.",
            time_4_title: "Πανελλαδική Αναγνώριση",
            time_4_desc: "Η Liakopoulos Casa αναγνωρίζεται πλέον ως σημείο αναφοράς στον χώρο.",
            time_5_title: "Σήμερα & Αύριο",
            time_5_desc: "Με πάνω από 250.000 προϊόντα, 200+ επώνυμες εταιρείες, και μια ομάδα αφοσιωμένων επαγγελματιών, συνεχίζουμε να εμπνέουμε και να εξυπηρετούμε. Ο στόχος παραμένει ο ίδιος: να κάνουμε κάθε σπίτι πιο όμορφο.",
            story_quote: "Κάθε σπίτι έχει μια ιστορία. Εμείς σας βοηθάμε να την γράψετε.",
            story_quote_author: "— Οικογένεια Λιακόπουλος",
            story_cta_title: "Ελάτε να μας<br>γνωρίσετε",
            story_cta_desc: "Σας περιμένουμε στο κατάστημά μας για μια εμπειρία που θα σας εμπνεύσει",
            // 404 Page
            error_title: "Η σελίδα δεν βρέθηκε",
            error_desc: "Η σελίδα που ψάχνετε δεν υπάρχει ή έχει μετακινηθεί. Επιστρέψτε στην αρχική ή εξερευνήστε τις κατηγορίες μας.",
            error_home_btn: "Αρχική Σελίδα"
        },
        en: {
            meta_title: "Liakopoulos Casa | Paints, Tools, Tiles, Home Decor in Rio Patras",
            meta_desc: "Liakopoulos Casa - Home materials, paints, tools, tiles, wallpapers, curtains, fireplaces, garden and decor. Family business with nationwide reputation since 1975 in Rio Patras.",
            nav_home: "Home",
            nav_categories: "Categories",
            nav_inspiration: "Inspiration",
            nav_story: "Our Story",
            nav_contact: "Contact",
            search_aria: "Search",
            search_placeholder: "Search category...",
            search_no_results: "No results found",
            hero_tagline: "Since 1975 — Family Tradition",
            hero_title_1: "Creating",
            hero_title_2: "spaces that",
            hero_title_3: "inspire",
            hero_desc: "Materials & ideas for every space",
            hero_btn_explore: "Explore",
            hero_btn_story: "Our Story",
            hero_scroll: "Scroll",
            marquee_building: "Building Materials",
            marquee_tools: "Tools",
            marquee_paints: "Paints",
            marquee_handles: "Door Handles",
            marquee_locks: "Locks",
            marquee_faucets: "Faucets & Taps",
            marquee_curtain_rods: "Curtain Rods",
            marquee_wallpapers: "Wallpapers",
            marquee_bathroom_acc: "Bathroom Accessories",
            marquee_garden_sheds: "Garden Sheds",
            cat_section_label: "01 / Categories",
            cat_section_title: "Everything your<br>home needs",
            cat_1_title: "Hardware",
            cat_1_desc: "Tools, materials, screws, adhesives",
            cat_2_title: "Paints",
            cat_2_desc: "Over 10,000 shades",
            cat_3_title: "Decoration",
            cat_3_desc: "Wallpapers, stone veneers, curtains",
            cat_4_title: "Bathroom",
            cat_4_desc: "Accessories, faucets, mirrors",
            popup_contact_btn: "Contact Us",
            why_label: "02 / Why Us",
            why_title: "50 years<br>of trust",
            why_desc: "Since 1975, the Liakopoulos family has been providing quality, service, and expertise to thousands of customers across Greece.",
            why_btn: "Our Story",
            feature_1_title: "Huge Product Range",
            feature_1_desc: "Over 8,500 items in stock, ready for delivery",
            feature_2_title: "Expert Staff",
            feature_2_desc: "Advice from experienced professionals",
            feature_3_title: "Experience Showroom",
            feature_3_desc: "Display of paints, tiles & wallpapers",
            feature_4_title: "Nationwide Delivery",
            feature_4_desc: "Shipping in 1-3 business days, everywhere",
            insp_label: "03 / Inspiration",
            insp_title: "Ideas for<br>your space",
            insp_desc: "Discover trends, combinations and solutions",
            insp_tag_1: "Trends 2025",
            insp_title_1: "Colors that transform",
            insp_desc_1: "The shades dominating interior design",
            insp_tag_2: "Garden",
            insp_title_2: "The perfect garden",
            insp_tag_3: "Bathroom",
            insp_title_3: "Modern bathroom",
            insp_tag_4: "Decoration",
            insp_title_4: "Wallpapers & decor",
            insp_more: "More ideas",
            stat_1_label: "Years of Experience",
            stat_2_label: "Products in Stock",
            stat_3_label: "Trusted Brands",
            stat_4_label: "Satisfied Customers",
            insta_label: "04 / Follow Us",
            insta_desc: "Daily inspiration on Instagram",
            insta_btn: "Follow Us",
            reviews_label: "05 / Reviews",
            reviews_title: "What our<br>customers say",
            reviews_desc: "Customer reviews on Google",
            reviews_count: "Based on 150+ Google reviews",
            review_1_name: "Maria K.",
            review_1_text: "Excellent store with a huge variety of paints. The staff helped me choose the ideal shades for my living room. I will definitely come back!",
            review_1_date: "2 weeks ago",
            review_2_name: "Giorgos P.",
            review_2_text: "Everything for the home in one place. Found tiles, paints, and tools at great prices. Top-notch service — they guide you accurately.",
            review_2_date: "1 month ago",
            review_3_name: "Antonis D.",
            review_3_text: "A family business with integrity. Renovated my entire home getting everything from here. Quality, prices, and service — 10/10.",
            review_3_date: "3 weeks ago",
            reviews_cta: "View all reviews on Google",
            cookie_text: "We use cookies to enhance your experience on our site. By continuing, you agree to our use of cookies in accordance with our <a href=\"#\" style=\"text-decoration: underline;\">Privacy Policy</a>.",
            cookie_accept: "Accept",
            cookie_decline: "Decline",
            footer_nav_title: "Navigation",
            footer_cat_title: "Categories",
            footer_contact_title: "Contact",
            footer_tagline: "The home of quality, since 1975",
            footer_address: "5 Christou Panagopoulou, Rio, Patras",
            footer_rights: "© 2025 Liakopoulos Casa. All rights reserved.",
            mobile_call: "Call Us",
            mobile_directions: "Directions",
            // Contact Page
            contact_page_label: "Contact",
            contact_hero_title: "We are waiting for you",
            contact_hero_desc: "Visit us to explore tailored solutions for your home and space together",
            contact_visit_title: "Visit Our Store",
            contact_address_label: "Address",
            contact_address_val: "5 Christou Panagopoulou<br>Rio, 265 04, Patras",
            contact_phone_label: "Phone",
            contact_hours_label: "Opening Hours",
            contact_hours_val: "Mon - Fri: 08:00 - 20:00<br>Saturday: 08:00 - 15:00<br><span style=\"color: rgba(255,255,255,0.4);\">Sunday: Closed</span>",
            contact_parking_title: "Free Parking",
            contact_parking_desc: "Private parking space right next to our store. Easy access from the main road.",
            form_title: "Send us a message",
            form_subtitle: "We will get back to you within 24 hours",
            form_name: "Name *",
            form_phone: "Phone",
            form_email: "Email *",
            form_message: "Message *",
            form_submit: "Send Message",
            // Categories Page
            cat_page_label: "Categories",
            cat_page_title: "Everything your<br>home needs",
            cat_page_desc: "Discover our comprehensive range — from paints and tiles to garden supplies and home decor",
            grid_building_title: "Building Materials",
            grid_building_desc: "Cement, tile adhesives, plasters, insulation",
            grid_tools_title: "Tools & Equipment",
            grid_tools_desc: "Professional & DIY tools from leading brands",
            grid_paint_title: "Paints & Colors",
            grid_paint_desc: "Over 10,000 shades for interior and exterior use",
            grid_handles_title: "Handles & Knobs",
            grid_handles_desc: "Doors, windows, furniture — classic & modern styles",
            grid_locks_title: "Locks & Security Cylinders",
            grid_locks_desc: "High security cylinders and door locks",
            grid_bath_title: "Bathroom Accessories",
            grid_bath_desc: "Towel holders, shelves, mirrors, dispensers",
            grid_kitchen_title: "Kitchen Accessories",
            grid_kitchen_desc: "Organization, cabinet fittings, wire baskets",
            grid_faucets_title: "Bathroom & Kitchen Taps",
            grid_faucets_desc: "Basin taps, sink mixers, bath and shower sets",
            grid_curtains_title: "Curtain Rods, Rollers & Roman Blinds",
            grid_curtains_desc: "Venetian blinds, panels, motorized mechanisms",
            grid_mailboxes_title: "Mailboxes",
            grid_mailboxes_desc: "Stainless steel, aluminum, modern and classic",
            grid_wallpaper_title: "Wallpapers",
            grid_wallpaper_desc: "Modern & classic patterns for every room",
            grid_stones_title: "Decorative Stone Veneers",
            grid_stones_desc: "Wall cladding stones for interior & exterior",
            grid_storage_title: "Storage Cabinets & Shelving",
            grid_storage_desc: "Utility cabinets, shelving racks, storage boxes",
            grid_garden_title: "Garden Sheds",
            grid_garden_desc: "Resin & metal outdoor storage sheds",
            grid_fences_title: "Wooden Garden Fencing",
            grid_fences_desc: "Fences, privacy screens, garden partitions",
            brands_label: "Partnerships",
            brands_title: "Brands we<br>trust",
            cat_cta_title: "Can't find<br>what you need?",
            cat_cta_desc: "Contact us — if it's not in stock, we'll source it for you",
            // Inspiration Page
            insp_page_label: "Inspiration",
            insp_page_title: "Ideas brought<br>to life",
            insp_page_desc: "Discover trends, color harmonies, materials and interior decor tips from our specialists",
            insp_art1_label: "Colors 2025",
            insp_art1_title: "Trending Shades of the Year",
            insp_art1_desc: "Nature inspires this year's palette: earthy tones, warm terracotta, deep forest greens and tranquil blues. Learn how to combine them with harmony and style.",
            insp_color_1: "Terracotta Warmth",
            insp_color_2: "Deep Forest Green",
            insp_color_3: "Serene Blue",
            insp_color_4: "Warm Vanilla",
            insp_art2_label: "Garden",
            insp_art2_title: "Create Your Own Outdoor Oasis",
            insp_art2_desc: "Turn your outdoor space into a sanctuary of relaxation. From automatic watering systems to planters, decorative lighting and outdoor furniture.",
            insp_tag_irrigation: "Irrigation",
            insp_tag_pots: "Planters",
            insp_tag_lighting: "Lighting",
            insp_tag_furniture: "Garden Furniture",
            insp_art3_label: "Bathroom",
            insp_art3_title: "The Modern Bathroom",
            insp_art3_desc: "Premium quality faucets, large-format tiles, walk-in showers. Design a bathroom that inspires relaxation and timeless elegance.",
            insp_art4_label: "Fireplace",
            insp_art4_title: "The Warmth of the Fireplace",
            insp_art4_desc: "A fireplace is more than heating — it is the heart of the home. Energy-efficient inserts, modern pellet stoves and functional decorative accessories.",
            tips_label: "Tips",
            tips_title: "Tips from our<br>specialists",
            tip_1_title: "Test before painting",
            tip_1_desc: "Always test your paint on a small section first. Natural and artificial light drastically affect how a color appears.",
            tip_2_title: "Think long-term",
            tip_2_desc: "Invest in high quality materials. A premium tile or durable paint retains its beauty and value for years.",
            tip_3_title: "Consult the experts",
            tip_3_desc: "Never hesitate to ask. Our team is always here to guide you through every choice and technical question.",
            cta_help_title: "Need<br>assistance?",
            cta_help_desc: "Our specialists will help you find the optimal solutions for your project",
            // Story Page
            story_page_label: "Our Story",
            story_hero_title: "One family,<br>one passion",
            story_hero_desc: "From a humble material warehouse at our start, to a trusted benchmark for thousands of homes across Greece",
            story_owner_label: "Owner",
            story_owner_name: "Orestis Liakopoulos",
            story_owner_p1: "Liakopoulos Casa was founded in 1975 in Rio, Patras by Orestis's father, with a vision to build a store providing complete solutions for every home. Today, Orestis proudly carries on the family tradition with a deep commitment to quality and dedicated customer service.",
            story_owner_p2: "With 50 years of accumulated expertise, deep market insight, and genuine personal connections with each customer, Orestis and his family continue to develop the store, constantly bringing premium products at competitive prices.",
            val_1_title: "Passion",
            val_1_desc: "We truly love what we do. Every product is selected with meticulous care and industry expertise.",
            val_2_title: "Trust",
            val_2_desc: "50 continuous years of trust earned from thousands of loyal customers.",
            val_3_title: "Evolution",
            val_3_desc: "Continuous renewal, importing novel products and following global design trends.",
            time_1_title: "The Beginning",
            time_1_desc: "The Liakopoulos family begins with a neighborhood building materials shop. Through perseverance and dedication, they lay the foundations of a trusted enterprise.",
            time_2_title: "Expansion & Growth",
            time_2_desc: "The shop expands. New product categories enrich the inventory: paints, tiles, wallpapers, and garden essentials. Reputation extends well beyond local borders.",
            time_3_title: "The Next Generation",
            time_3_desc: "The second generation takes over, bringing contemporary ideas and modern vision. New partnerships with leading European brands and creation of an interactive showroom.",
            time_4_title: "Nationwide Recognition",
            time_4_desc: "Liakopoulos Casa becomes widely established as a benchmark for quality home improvement and decor.",
            time_5_title: "Today & Tomorrow",
            time_5_desc: "With over 250,000 products, 200+ top brands, and a dedicated team of professionals, we continue to inspire and serve. The goal remains unchanged: to make every home more beautiful.",
            story_quote: "Every home has a story. We help you write yours.",
            story_quote_author: "— The Liakopoulos Family",
            story_cta_title: "Come meet<br>us in person",
            story_cta_desc: "We look forward to welcoming you to our showroom for an inspiring experience",
            // 404 Page
            error_title: "Page Not Found",
            error_desc: "The page you are looking for does not exist or has been moved. Return home or browse our categories.",
            error_home_btn: "Homepage"
        },
        it: {
            meta_title: "Liakopoulos Casa | Colori, Utensili, Piastrelle, Arredo a Rio Patrasso",
            meta_desc: "Liakopoulos Casa - Materiali per la casa, colori, utensili, piastrelle, carta da parati, tende, caminetti, giardino e decorazione. Impresa familiare dal 1975 a Rio Patrasso.",
            nav_home: "Home",
            nav_categories: "Categorie",
            nav_inspiration: "Ispirazione",
            nav_story: "La Nostra Storia",
            nav_contact: "Contatti",
            search_aria: "Cerca",
            search_placeholder: "Cerca categoria...",
            search_no_results: "Nessun risultato trovato",
            hero_tagline: "Dal 1975 — Tradizione di Famiglia",
            hero_title_1: "Creiamo",
            hero_title_2: "spazi che",
            hero_title_3: "ispirano",
            hero_desc: "Materiali e idee per ogni spazio",
            hero_btn_explore: "Esplora",
            hero_btn_story: "La Nostra Storia",
            hero_scroll: "Scroll",
            marquee_building: "Materiali Edili",
            marquee_tools: "Utensili",
            marquee_paints: "Colori e Pitture",
            marquee_handles: "Maniglie",
            marquee_locks: "Serrature",
            marquee_faucets: "Rubinetteria",
            marquee_curtain_rods: "Bastoni per Tende",
            marquee_wallpapers: "Carta da Parati",
            marquee_bathroom_acc: "Accessori Bagno",
            marquee_garden_sheds: "Casette da Giardino",
            cat_section_label: "01 / Categorie",
            cat_section_title: "Tutto ciò di cui<br>la tua casa ha bisogno",
            cat_1_title: "Ferramenta",
            cat_1_desc: "Utensili, materiali, viti, adesivi",
            cat_2_title: "Colori e Pitture",
            cat_2_desc: "Oltre 10.000 tonalità",
            cat_3_title: "Decorazione",
            cat_3_desc: "Carta da parati, pietre, tende",
            cat_4_title: "Bagno",
            cat_4_desc: "Accessori, rubinetteria, specchi",
            popup_contact_btn: "Contattaci",
            why_label: "02 / Perché Noi",
            why_title: "50 anni<br>di fiducia",
            why_desc: "Dal 1975, la famiglia Liakopoulos offre qualità, servizio e competenza a migliaia di clienti in tutta la Grecia.",
            why_btn: "La Nostra Storia",
            feature_1_title: "Vasta Gamma di Prodotti",
            feature_1_desc: "Oltre 8.500 articoli in magazzino, pronti per la consegna",
            feature_2_title: "Personale Specializzato",
            feature_2_desc: "Consulenza da professionisti con anni di esperienza",
            feature_3_title: "Showroom Esperienziale",
            feature_3_desc: "Esposizione di colori, piastrelle e carta da parati",
            feature_4_title: "Consegna in Tutta la Grecia",
            feature_4_desc: "Spedizione in 1-3 giorni lavorativi ovunque",
            insp_label: "03 / Ispirazione",
            insp_title: "Idee per<br>il tuo spazio",
            insp_desc: "Scopri tendenze, combinazioni e soluzioni",
            insp_tag_1: "Tendenze 2025",
            insp_title_1: "Colori che trasformano",
            insp_desc_1: "Le tonalità protagoniste dell'arredo",
            insp_tag_2: "Giardino",
            insp_title_2: "Il giardino perfetto",
            insp_tag_3: "Bagno",
            insp_title_3: "Bagno moderno",
            insp_tag_4: "Decorazione",
            insp_title_4: "Carta da parati e decorazioni",
            insp_more: "Altre idee",
            stat_1_label: "Anni di Esperienza",
            stat_2_label: "Prodotti in Stock",
            stat_3_label: "Marchi Rinomati",
            stat_4_label: "Clienti Soddisfatti",
            insta_label: "04 / Seguici",
            insta_desc: "Ispirazione quotidiana su Instagram",
            insta_btn: "Seguici",
            reviews_label: "05 / Recensioni",
            reviews_title: "Cosa dicono<br>i nostri clienti",
            reviews_desc: "Recensioni dei clienti su Google",
            reviews_count: "Basato su oltre 150 recensioni Google",
            review_1_name: "Maria K.",
            review_1_text: "Negozio eccellente con una vastissima varietà di colori. Lo staff mi ha aiutato a scegliere le tonalità ideali per il mio soggiorno. Tornerò sicuramente!",
            review_1_date: "2 settimane fa",
            review_2_name: "Giorgio P.",
            review_2_text: "Tutto per la casa in un unico posto. Ho trovato piastrelle, vernici e attrezzi a ottimi prezzi. Servizio impeccabile — ti guidano con precisione.",
            review_2_date: "1 mese fa",
            review_3_name: "Antonio D.",
            review_3_text: "Un'azienda familiare di grande professionalità. Ho ristrutturato tutta la casa acquistando tutto qui. Qualità, prezzi e servizio — 10/10.",
            review_3_date: "3 settimane fa",
            reviews_cta: "Vedi tutte le recensioni su Google",
            cookie_text: "Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito. Continuando, accetti l'uso dei cookie secondo la nostra <a href=\"#\" style=\"text-decoration: underline;\">Informativa sulla Privacy</a>.",
            cookie_accept: "Accetta",
            cookie_decline: "Rifiuta",
            footer_nav_title: "Navigazione",
            footer_cat_title: "Categorie",
            footer_contact_title: "Contatti",
            footer_tagline: "La casa della qualità, dal 1975",
            footer_address: "Christou Panagopoulou 5, Rio, Patrasso",
            footer_rights: "© 2025 Liakopoulos Casa. Tutti i diritti riservati.",
            mobile_call: "Chiamaci",
            mobile_directions: "Indicazioni",
            // Contact Page
            contact_page_label: "Contatti",
            contact_hero_title: "Vi aspettiamo",
            contact_hero_desc: "Venite a scoprire insieme a noi le soluzioni su misura per la vostra casa",
            contact_visit_title: "Venite a trovarci",
            contact_address_label: "Indirizzo",
            contact_address_val: "Christou Panagopoulou 5<br>Rio, 265 04, Patrasso",
            contact_phone_label: "Telefono",
            contact_hours_label: "Orari di Apertura",
            contact_hours_val: "Lun - Ven: 08:00 - 20:00<br>Sabato: 08:00 - 15:00<br><span style=\"color: rgba(255,255,255,0.4);\">Domenica: Chiuso</span>",
            contact_parking_title: "Parcheggio Gratuito",
            contact_parking_desc: "Parcheggio privato disponibile direttamente accanto al negozio. Facile accesso dalla strada principale.",
            form_title: "Inviaci un messaggio",
            form_subtitle: "Ti risponderemo entro 24 ore",
            form_name: "Nome *",
            form_phone: "Telefono",
            form_email: "Email *",
            form_message: "Messaggio *",
            form_submit: "Invia Messaggio",
            // Categories Page
            cat_page_label: "Categorie",
            cat_page_title: "Tutto ciò di cui<br>la tua casa ha bisogno",
            cat_page_desc: "Scopri la nostra vasta gamma — dai colori e piastrelle fino al giardino e decorazioni d'arredo",
            grid_building_title: "Materiali Edili",
            grid_building_desc: "Cemento, collanti, intonaci, isolanti termici",
            grid_tools_title: "Utensili e Attrezzi",
            grid_tools_desc: "Attrezzi professionali e per il fai-da-te dei migliori marchi",
            grid_paint_title: "Colori e Pitture",
            grid_paint_desc: "Oltre 10.000 tonalità per interni ed esterni",
            grid_handles_title: "Maniglie e Pomelli",
            grid_handles_desc: "Porte, finestre, mobili — stili classici e moderni",
            grid_locks_title: "Serrature e Cilindri di Sicurezza",
            grid_locks_desc: "Cilindri di sicurezza antieffrazione e serrature",
            grid_bath_title: "Accessori Bagno",
            grid_bath_desc: "Portasciugamani, mensole, specchi, dispenser",
            grid_kitchen_title: "Accessori Cucina",
            grid_kitchen_desc: "Organizzazione, accessori per pensili, cestelli",
            grid_faucets_title: "Rubinetteria Bagno e Cucina",
            grid_faucets_desc: "Miscelatori lavabo, lavello, vasca e doccia",
            grid_curtains_title: "Bastoni per Tende, Rullo, Pacchetto",
            grid_curtains_desc: "Veneziane, pannelli, meccanismi per tende",
            grid_mailboxes_title: "Cassette Postali",
            grid_mailboxes_desc: "Inox, alluminio, modelli classici e moderni",
            grid_wallpaper_title: "Carta da Parati",
            grid_wallpaper_desc: "Motivi moderni e classici per ogni ambiente",
            grid_stones_title: "Pietre Decorative da Rivestimento",
            grid_stones_desc: "Rivestimenti in pietra per interni ed esterni",
            grid_storage_title: "Armadi e Sistemi di Stoccaggio",
            grid_storage_desc: "Armadi multiuso, scaffalature, contenitori",
            grid_garden_title: "Casette da Giardino",
            grid_garden_desc: "Casette e box da esterno in resina e metallo",
            grid_fences_title: "Recinzioni in Legno per Giardino",
            grid_fences_desc: "Staccionate, pannelli frangivista e divisori",
            brands_label: "Collaborazioni",
            brands_title: "Marchi di cui<br>ci fidiamo",
            cat_cta_title: "Non trovi<br>qualcosa?",
            cat_cta_desc: "Contattaci — se non è disponibile in magazzino, lo ordineremo per te",
            // Inspiration Page
            insp_page_label: "Ispirazione",
            insp_page_title: "Idee che<br>prendono vita",
            insp_page_desc: "Scopri tendenze, accostamenti di colore, materiali e consigli di design dai nostri esperti",
            insp_art1_label: "Tendenze Colori 2025",
            insp_art1_title: "Le tonalità protagoniste dell'anno",
            insp_art1_desc: "La natura ispira la palette di quest'anno: toni della terra, calda terracotta, verdi bosco intensi e blu sereni. Scopri come abbinarli con armonia e stile.",
            insp_color_1: "Terracotta Warmth",
            insp_color_2: "Deep Forest Green",
            insp_color_3: "Serene Blue",
            insp_color_4: "Warm Vanilla",
            insp_art2_label: "Giardino",
            insp_art2_title: "Crea il tuo angolo di paradiso",
            insp_art2_desc: "Trasforma il tuo spazio esterno in un'oasi di benessere. Dai sistemi di irrigazione ai vasi, illuminazione decorativa e arredo giardino.",
            insp_tag_irrigation: "Irrigazione",
            insp_tag_pots: "Vasi e Fioriere",
            insp_tag_lighting: "Illuminazione",
            insp_tag_furniture: "Arredo Giardino",
            insp_art3_label: "Bagno",
            insp_art3_title: "Il Bagno Moderno",
            insp_art3_desc: "Rubinetteria di alta qualità, piastrelle di grande formato, docce walk-in. Progetta un bagno che regali relax ed eleganza.",
            insp_art4_label: "Caminetto",
            insp_art4_title: "Il calore del caminetto",
            insp_art4_desc: "Un caminetto è molto più del riscaldamento: è il cuore pulsante della casa. Inserti termici, stufe a pellet moderne e accessori funzionali ed eleganti.",
            tips_label: "Consigli",
            tips_title: "Consigli dai nostri<br>esperti",
            tip_1_title: "Fai sempre una prova",
            tip_1_desc: "Testa sempre la vernice su una piccola superficie. La luce naturale e artificiale modifica notevolmente la tonalità percepita.",
            tip_2_title: "Pensa a lungo termine",
            tip_2_desc: "Investi in materiali di qualità superiore. Una buona piastrella o una pittura pregiata durano intatte per molti anni.",
            tip_3_title: "Chiedi agli specialisti",
            tip_3_desc: "Non esitare a consultarci. Il nostro team è sempre a disposizione per guidarti in ogni scelta tecnica ed estetica.",
            cta_help_title: "Hai bisogno<br>di aiuto?",
            cta_help_desc: "I nostri esperti ti aiuteranno a trovare le soluzioni ideali per la tua casa",
            // Story Page
            story_page_label: "La Nostra Storia",
            story_hero_title: "Una famiglia,<br>una passione",
            story_hero_desc: "Da un piccolo deposito di materiali agli inizi, a un punto di riferimento per migliaia di case in tutta la Grecia",
            story_owner_label: "Titolare",
            story_owner_name: "Orestis Liakopoulos",
            story_owner_p1: "Liakopoulos Casa è stata fondata nel 1975 a Rio di Patrasso dal padre di Orestis, con l'obiettivo di offrire soluzioni complete e di qualità per ogni casa. Oggi Orestis porta avanti la tradizione familiare con passione per l'eccellenza e attenzione per il cliente.",
            story_owner_p2: "Con 50 anni di solida esperienza, profonda conoscenza del settore e un rapporto di fiducia personale con ogni cliente, Orestis e la sua famiglia continuano a innovare il negozio offrendo prodotti di prima scelta ai prezzi più vantaggiosi.",
            val_1_title: "Passione",
            val_1_desc: "Amiamo sinceramente il nostro lavoro. Ogni articolo viene selezionato con cura meticolosa e competenza.",
            val_2_title: "Fiducia",
            val_2_desc: "50 anni ininterrotti di fiducia e stima da parte di migliaia di clienti.",
            val_3_title: "Evoluzione",
            val_3_desc: "Aggiornamento costante, introduzione di prodotti innovativi e attenzione ai trend internazionali.",
            time_1_title: "Gli Inizi",
            time_1_desc: "La famiglia Liakopoulos avvia una piccola rivendita di materiali edili nel quartiere. Con tenacia e dedizione, getta le basi di quella che diventerà una realtà consolidata.",
            time_2_title: "Crescita ed Espansione",
            time_2_desc: "L'attività cresce e si arricchisce di nuovi reparti: pitture, ceramiche, carta da parati e articoli per il giardino. La reputazione si estende ben oltre i confini locali.",
            time_3_title: "La Nuova Generazione",
            time_3_desc: "La seconda generazione prende le redini, portando idee innovative e visione moderna. Nuove partnership con i più prestigiosi marchi europei e allestimento di un moderno showroom.",
            time_4_title: "Riconoscimento Nazionale",
            time_4_desc: "Liakopoulos Casa viene ampiamente riconosciuta come un polo di riferimento per l'edilizia e l'arredamento di qualità.",
            time_5_title: "Oggi e Domani",
            time_5_desc: "Con oltre 250.000 articoli, più di 200 aziende leader e una squadra di professionisti esperti, continuiamo a ispirare e servire al meglio. L'obiettivo rimane lo stesso: rendere ogni casa più accogliente.",
            story_quote: "Ogni casa ha una storia. Noi vi aiutiamo a scriverla.",
            story_quote_author: "— Famiglia Liakopoulos",
            story_cta_title: "Venite a<br>conoscerci",
            story_cta_desc: "Vi aspettiamo nel nostro showroom per un'esperienza che vi ispirerà",
            // 404 Page
            error_title: "Pagina Non Trovata",
            error_desc: "La pagina che stai cercando non esiste o è stata spostata. Torna alla home page o esplora le nostre categorie.",
            error_home_btn: "Pagina Iniziale"
        }
    };

    const categoryTranslations = {
        el: {
            sidirika: { title: 'Σιδηρικά', items: ['Κλειδαριές', 'Κύλινδροι ασφαλείας', 'Σούστες πόρτας', 'Μεντεσέδες', 'Γωνίες στήριξης', 'Βάσεις χαγιατιών', 'Κατσαβίδια', 'Βίδες', 'Πρόκες', 'Βύσματα (μπετόν, γυψοσανίδας, τούβλου κ.λπ.)', 'Αντικλείδια', 'Λουκέτα', 'Σύρτες', 'Πένσες', 'Γκαζοτανάλιες', 'Μυτοτσίμπιδα', 'Δεματικά / Tire ups', 'Σύρματα', 'Σίτες (fiberglass, αλουμινίου, pet)', 'Κουνελόπλεγμα', 'Αλυσίδες', 'Σχοινιά', 'Αερόπλαστ', 'Αεροχάρτ', 'Δίχτυ σκίασης', 'Νάιλον επικάλυψης', 'Δίχτυα μπαλκονιών', 'Χρηματοκιβώτια', 'Μηχανισμοί συρταριών', 'Πιατοθήκες', 'Κουταλοθήκες', 'Πάτοι κουζίνας / Νεροσυλλέκτες', 'Λάστιχα κήπου', 'Συστήματα ποτίσματος', '...και άλλα πολλά'] },
            xromata: { title: 'Χρώματα', items: ['Πλαστικά', 'Ακρυλικά', 'Μονωτικά τοίχου', 'Μονωτικά ταράτσας', 'Αστάρια νερού / διαλυτικού / χαλαζιακά', 'Βερνίκια εμποτισμού εξωτερικής χρήσης', 'Βερνίκια επικάλυψης νερού', 'Λαδομπογιές σιδήρου / ξύλου', 'Λαδομπογιές 3σε1', 'Λαδομπογιές νερού', 'Σπρέι χρωμάτων', 'WD-40', 'Αφροί πολυουρεθάνης', 'Μαστίχες στεγανοποίησης', 'Polymax', 'Σιλικόνες', 'Χρώματα διαγράμμισης', 'Χρώματα πισίνας', 'Χρώματα μεταλιζέ / γραφίτες', 'Κόλλες πλακιδίων', 'Σοβάδες', 'Παρεντίνες', 'Ταινίες στεγανοποίησης αλουμινίου', 'Πιστόλια σιλικόνης', '...και άλλα πολλά'] },
            diakosmitika: { title: 'Διακοσμητικά', items: ['Πόμολα', 'Λαβές εξώθυρας', 'Λαβές ντουλάπας', 'Πομολάκια ντουλάπας', 'Αριθμοί κατοικιών', 'Γραμματοκιβώτια', 'Μαγνήτες πορτών', 'Συστήματα σκίασης (ρόλερ, στόρια, κάθετες περσίδες)', 'Στόρια ξύλινα και αλουμινίου', 'Συρτές διακοσμητικοί', 'Πάνελ τοίχου', 'Σανίδες WPC', 'Κουρτινόβεργες', 'Σιδηρόδρομοι κουρτίνας', 'Κρεμάστρες', 'Αξεσουάρ τζακιού', '...και άλλα πολλά'] },
            mpanio: { title: 'Μπάνιο', items: ['Πλακίδια', 'Έπιπλα', 'Καθρέφτες', 'Είδη υγιεινής', 'Νιπτήρες', 'Καμπίνες', 'Μπαταρίες', 'Αξεσουάρ (χαρτοθήκες, πετσετοκρεμάστρες, dispenser, ποτηροθήκες)', 'Σπιράλ', 'Τηλέφωνα', 'Πιγκάλ', 'Κάδοι', '...και άλλα πολλά'] }
        },
        en: {
            sidirika: { title: 'Hardware & Tools', items: ['Locks', 'Security cylinders', 'Door closers', 'Hinges', 'Corner braces & brackets', 'Porch brackets', 'Screwdrivers', 'Screws', 'Nails', 'Wall plugs & anchors (concrete, drywall, brick, etc.)', 'Key duplicates', 'Padlocks', 'Bolts & latches', 'Pliers', 'Water pump pliers', 'Needle-nose pliers', 'Cable ties / Zip ties', 'Wires', 'Insect screens (fiberglass, aluminum, pet)', 'Wire mesh', 'Chains', 'Ropes', 'Bubble wrap', 'Kraft paper', 'Shade netting', 'Polyethylene sheeting', 'Balcony netting', 'Safes', 'Drawer slides', 'Dish racks', 'Cutlery organizers', 'Under-sink drip trays', 'Garden hoses', 'Irrigation systems', '...and much more'] },
            xromata: { title: 'Paints & Coatings', items: ['Emulsion paints', 'Acrylic paints', 'Wall waterproofing coatings', 'Roof waterproofing coatings', 'Water / solvent / quartz primers', 'Exterior wood stains & varnishes', 'Water-based topcoat varnishes', 'Enamel paints for metal / wood', '3-in-1 anti-rust enamel paints', 'Water-based enamel paints', 'Spray paints', 'WD-40', 'Polyurethane foams', 'Sealing mastics', 'Polymax', 'Silicones', 'Road marking paints', 'Pool paints', 'Metallic & graphite paints', 'Tile adhesives', 'Plasters & renders', 'Putty & fillers', 'Aluminum waterproofing tapes', 'Silicone guns', '...and much more'] },
            diakosmitika: { title: 'Decoration & Interior', items: ['Door knobs & handles', 'Front door pull handles', 'Wardrobe handles', 'Cabinet knobs', 'House numbers', 'Mailboxes', 'Door magnets & stoppers', 'Shading systems (roller blinds, venetian blinds, vertical blinds)', 'Wooden & aluminum blinds', 'Decorative slide bolts', 'Wall panels', 'WPC composite decking & boards', 'Curtain rods', 'Curtain rails', 'Coat hangers & hooks', 'Fireplace accessories', '...and much more'] },
            mpanio: { title: 'Bathroom', items: ['Tiles', 'Bathroom furniture', 'Mirrors', 'Sanitary ware', 'Washbasins', 'Shower enclosures & cabins', 'Faucets & taps', 'Accessories (toilet paper holders, towel rails, soap dispensers, tumbler holders)', 'Flexible hoses', 'Shower heads & hand showers', 'Toilet brushes', 'Waste bins', '...and much more'] }
        },
        it: {
            sidirika: { title: 'Ferramenta e Utensili', items: ['Serrature', 'Cilindri di sicurezza', 'Chiudiporta', 'Cerniere', 'Staffe e supporti angolari', 'Supporti per tettoie', 'Cacciaviti', 'Viti', 'Chiodi', 'Tasselli e ancoraggi (cemento, cartongesso, mattone, ecc.)', 'Duplicazione chiavi', 'Lucchetti', 'Catenacci', 'Pinze', 'Pinze a pappagallo', 'Pinze a becco', 'Fascette per cavi', 'Fili metallici', 'Zanzariere (fibra di vetro, alluminio, pet)', 'Reti metalliche', 'Catene', 'Corde', 'Pluriball', 'Carta da imballo', 'Reti ombreggianti', 'Teli in nylon protettivi', 'Reti per balconi', 'Casseforti', 'Guide per cassetti', 'Scolapiatti', 'Portaposate', 'Sottolavelli / Salvagoccia', 'Tubi da giardino', 'Sistemi di irrigazione', '...e molto altro'] },
            xromata: { title: 'Colori e Vernici', items: ['Idropitture traspiranti', 'Pitture acriliche', 'Impermeabilizzanti per pareti', 'Guaine liquide per terrazzi', 'Primer ad acqua / a solvente / al quarzo', 'Impregnanti protettivi per legno da esterno', 'Vernici di finitura ad acqua', 'Smalti per ferro / legno', 'Smalti antiruggine 3in1', 'Smalti all\'acqua', 'Vernici spray', 'WD-40', 'Schiume poliuretaniche', 'Sigillanti edili', 'Polymax', 'Siliconi', 'Vernici per segnaletica', 'Vernici per piscine', 'Smalti metallizzati e grafite', 'Adesivi per piastrelle', 'Intonaci', 'Stucchi per pareti', 'Nastri sigillanti in alluminio', 'Pistole per silicone', '...e molto altro'] },
            diakosmitika: { title: 'Decorazione e Arredo', items: ['Maniglie per porte', 'Maniglioni per portoni', 'Maniglie per armadi', 'Pomelli per mobili', 'Numeri civici', 'Cassette postali', 'Fermi e magneti per porte', 'Sistemi oscuranti (rullo, veneziane, tende verticali)', 'Tende alla veneziana in legno e alluminio', 'Catenacci decorativi', 'Pannelli decorativi 3D per pareti', 'Listoni WPC', 'Bastoni per tende', 'Binari per tende', 'Appendiabiti e ganci', 'Accessori per caminetto', '...e molto altro'] },
            mpanio: { title: 'Bagno', items: ['Piastrelle', 'Mobili da bagno', 'Specchi', 'Sanitari', 'Lavabi', 'Box e cabine doccia', 'Rubinetteria e miscelatori', 'Accessori (portarotolo, portasalviette, dispenser, bicchieri)', 'Flessibili doccia', 'Soffioni e doccette', 'Scopini WC', 'Cestini gettacarte', '...e molto altro'] }
        }
    };

    let currentLang = 'el';
    let currentPopupCategory = null;

    const popup = document.getElementById('categoryPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupList = document.getElementById('popupList');
    const popupClose = document.getElementById('popupClose');

    // Build Search Index
    let searchIndex = [];
    function buildSearchIndex() {
        searchIndex = [];
        const catObj = categoryTranslations[currentLang] || categoryTranslations.el;
        Object.keys(catObj).forEach(key => {
            const cat = catObj[key];
            searchIndex.push({ name: cat.title, parent: '', category: key });
            cat.items.forEach(item => {
                if (!item.startsWith('...') && !item.includes('...')) {
                    searchIndex.push({ name: item, parent: cat.title, category: key });
                }
            });
        });
    }

    // Set Language Function
    function setLanguage(lang) {
        if (!translations[lang]) lang = 'el';
        currentLang = lang;

        document.documentElement.lang = lang;

        // Meta tags & title
        if (translations[lang].meta_title) {
            document.title = translations[lang].meta_title;
        }
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && translations[lang].meta_desc) {
            metaDesc.setAttribute('content', translations[lang].meta_desc);
        }
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && translations[lang].meta_title) {
            ogTitle.setAttribute('content', translations[lang].meta_title);
        }
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && translations[lang].meta_desc) {
            ogDesc.setAttribute('content', translations[lang].meta_desc);
        }

        // Elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = translations[lang]?.[key];
            if (text !== undefined) {
                if (text.includes('<') && text.includes('>')) {
                    el.innerHTML = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        // Elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const text = translations[lang]?.[key];
            if (text !== undefined) {
                el.setAttribute('placeholder', text);
            }
        });

        // Elements with data-i18n-attr
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const attrSpec = el.getAttribute('data-i18n-attr');
            const [attr, key] = attrSpec.split(':');
            if (attr && key && translations[lang]?.[key] !== undefined) {
                el.setAttribute(attr, translations[lang][key]);
            }
        });

        // Elements with data-i18n-text (for hover data-text)
        document.querySelectorAll('[data-i18n-text]').forEach(el => {
            const key = el.getAttribute('data-i18n-text');
            const text = translations[lang]?.[key];
            if (text !== undefined) {
                el.setAttribute('data-text', text);
            }
        });

        // Update active buttons on language switchers
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Refresh open category popup if open
        if (currentPopupCategory && popup && popup.classList.contains('active')) {
            const data = categoryTranslations[currentLang]?.[currentPopupCategory];
            if (data) {
                popupTitle.textContent = data.title;
                popupList.innerHTML = data.items.map(item => `<li>${item}</li>`).join('');
            }
        }

        buildSearchIndex();

        try {
            localStorage.setItem('liakopoulos_lang', lang);
        } catch (e) {}
    }

    // Initialize Language (Default is Greek)
    const savedLang = localStorage.getItem('liakopoulos_lang');
    const initialLang = (savedLang && translations[savedLang]) ? savedLang : 'el';
    setLanguage(initialLang);

    // Language switcher click handlers
    document.querySelectorAll('.lang-btn, .mobile-lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            if (lang) {
                setLanguage(lang);
            }
        });
    });

    // Category Card Click
    document.querySelectorAll('.category-card[data-category]').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.category;
            const data = (categoryTranslations[currentLang] || categoryTranslations.el)[key];
            if (!data || !popup) return;

            currentPopupCategory = key;
            popupTitle.textContent = data.title;
            popupList.innerHTML = data.items.map(item => `<li>${item}</li>`).join('');
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (popupClose) {
        popupClose.addEventListener('click', () => {
            popup.classList.remove('active');
            currentPopupCategory = null;
            document.body.style.overflow = '';
        });
    }

    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('active');
                currentPopupCategory = null;
                document.body.style.overflow = '';
            }
        });
    }

    // === Search Functionality ===
    const searchToggle = document.getElementById('searchToggle');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

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
                const noResText = translations[currentLang]?.search_no_results || 'Δεν βρέθηκαν αποτελέσματα';
                searchResults.innerHTML = `<div class="search-no-results">${noResText}</div>`;
                return;
            }

            matches.forEach(item => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.textContent = item.parent ? `${item.name} → ${item.parent}` : item.name;
                div.addEventListener('click', () => {
                    // Open the popup for this category
                    const data = (categoryTranslations[currentLang] || categoryTranslations.el)[item.category];
                    if (data && popup) {
                        currentPopupCategory = item.category;
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
