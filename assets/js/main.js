/* ============================================
   nmmnt. — main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', function ()
{
    /* ------------------------------------------
       INTRO
    ------------------------------------------ */
    const intro = document.getElementById('intro');
    if (intro)
    {
        setTimeout(function ()
        {
            intro.classList.add('hidden');
            setTimeout(function ()
            {
                intro.style.display = 'none';
            }, 600);
        }, 2200);
    }

    /* ------------------------------------------
       HEADER — scroll state
    ------------------------------------------ */
    const header = document.getElementById('header');
    let lastScroll = 0;

    function onScroll()
    {
        const scrollY = window.scrollY;

        if (scrollY > 80)
        {
            header.classList.add('scrolled');
        }
        else
        {
            header.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ------------------------------------------
       HEADER — active nav link
    ------------------------------------------ */
    const navLinks = document.querySelectorAll('.header-nav ul a');
    const sections = document.querySelectorAll('.sec[id]');

    function updateActiveNav()
    {
        const scrollY = window.scrollY + window.innerHeight / 3;

        sections.forEach(function (section)
        {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            navLinks.forEach(function (link)
            {
                if (link.getAttribute('data-section') === id)
                {
                    if (scrollY >= top && scrollY < bottom)
                    {
                        link.classList.add('active');
                    }
                    else
                    {
                        link.classList.remove('active');
                    }
                }
            });
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ------------------------------------------
       BURGER MENU
    ------------------------------------------ */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav)
    {
        burger.addEventListener('click', function ()
        {
            burger.classList.toggle('open');
            nav.classList.toggle('open');
            document.body.classList.toggle('locked');
        });

        // Close nav on link click
        nav.querySelectorAll('a').forEach(function (link)
        {
            link.addEventListener('click', function ()
            {
                burger.classList.remove('open');
                nav.classList.remove('open');
                document.body.classList.remove('locked');
            });
        });
    }

    /* ------------------------------------------
       SMOOTH SCROLL for anchor links
    ------------------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor)
    {
        anchor.addEventListener('click', function (event)
        {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);

            if (target)
            {
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
                const top = target.offsetTop - offset;

                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ------------------------------------------
       SCROLL ANIMATIONS (Intersection Observer)
    ------------------------------------------ */
    const animatedElements = document.querySelectorAll('.anime');

    if ('IntersectionObserver' in window)
    {
        const observer = new IntersectionObserver(function (entries)
        {
            entries.forEach(function (entry)
            {
                if (entry.isIntersecting)
                {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        animatedElements.forEach(function (el)
        {
            observer.observe(el);
        });
    }
    else
    {
        // Fallback — show everything
        animatedElements.forEach(function (el)
        {
            el.classList.add('visible');
        });
    }

    /* ------------------------------------------
       VIMEO VIDEO MODAL
    ------------------------------------------ */
    const modal = document.getElementById('modal-video');
    const modalIframe = document.getElementById('modal-iframe');
    const modalClose = modal ? modal.querySelector('.modal-close') : null;
    const modalBg = modal ? modal.querySelector('.modal-bg') : null;
    const vimeoButtons = document.querySelectorAll('.btn-vimeo');

    function openModal(vimeoId)
    {
        if (!modal || !modalIframe) return;

        modalIframe.src = 'https://player.vimeo.com/video/' + vimeoId + '?autoplay=1&title=0&byline=0&portrait=0';
        modal.classList.add('open');
        document.body.classList.add('locked');
    }

    function closeModal()
    {
        if (!modal || !modalIframe) return;

        modal.classList.remove('open');
        document.body.classList.remove('locked');

        // Delay clearing src to avoid flash
        setTimeout(function ()
        {
            modalIframe.src = '';
        }, 400);
    }

    vimeoButtons.forEach(function (btn)
    {
        btn.addEventListener('click', function ()
        {
            const vimeoId = this.getAttribute('data-vimeo-id');
            if (vimeoId && vimeoId !== 'VIMEO_ID_1')
            {
                openModal(vimeoId);
            }
        });
    });

    if (modalClose)
    {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalBg)
    {
        modalBg.addEventListener('click', closeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function (event)
    {
        if (event.key === 'Escape')
        {
            closeModal();
        }
    });

    /* ------------------------------------------
       FOTO GALLERY — LIGHTBOX (simple)
    ------------------------------------------ */
    const fotoItems = document.querySelectorAll('.foto-item');

    fotoItems.forEach(function (item)
    {
        item.addEventListener('click', function ()
        {
            const img = this.querySelector('img');
            if (!img) return;

            // Create simple lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'modal open';
            lightbox.style.zIndex = '10001';
            lightbox.innerHTML = '<div class="modal-bg"></div>'
                + '<button class="modal-close" aria-label="Zavřít">&times;</button>'
                + '<div class="modal-inner" style="aspect-ratio:auto; max-height:90vh; display:flex; align-items:center; justify-content:center;">'
                + '<img src="' + img.src + '" alt="' + img.alt + '" style="max-width:100%; max-height:90vh; object-fit:contain; border-radius:8px;">'
                + '</div>';

            document.body.appendChild(lightbox);
            document.body.classList.add('locked');

            // Close handlers
            function closeLightbox()
            {
                lightbox.classList.remove('open');
                document.body.classList.remove('locked');
                setTimeout(function ()
                {
                    lightbox.remove();
                }, 400);
            }

            lightbox.querySelector('.modal-bg').addEventListener('click', closeLightbox);
            lightbox.querySelector('.modal-close').addEventListener('click', closeLightbox);

            document.addEventListener('keydown', function handler(event)
            {
                if (event.key === 'Escape')
                {
                    closeLightbox();
                    document.removeEventListener('keydown', handler);
                }
            });
        });
    });

    /* ------------------------------------------
       FORM — basic validation feedback
    ------------------------------------------ */
    const form = document.querySelector('.contact-form');

    if (form)
    {
        form.addEventListener('submit', function (event)
        {
            const submitBtn = form.querySelector('.form-submit');

            // If using Formspree, let it handle submission
            // This just provides visual feedback
            if (submitBtn)
            {
                submitBtn.textContent = 'Odesílám…';
                submitBtn.style.opacity = '0.7';
                submitBtn.style.pointerEvents = 'none';
            }
        });
    }
});
