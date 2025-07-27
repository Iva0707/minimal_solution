// ____________ full screen ____________

const fullPageScroll = ({ sectionsSelector, bulletsSelector, containerSelector }) => {
	const sections = document.querySelectorAll(sectionsSelector);
	const bulletsContainer = document.querySelector(bulletsSelector);
	const container = document.querySelector(containerSelector);

	if (!sections.length || !bulletsContainer || !container) return;

	let current = 0;
	let isScrolling = false;
	const bullets = [];

	const createBullets = () => {
		sections.forEach((_, i) => {
			const bullet = document.createElement("button");
			bullet.classList.add("bullet");
			if (i === 0) bullet.classList.add("bullet--active");

			bullet.addEventListener("click", () => scrollToSection(i));

			bulletsContainer.appendChild(bullet);
			bullets.push(bullet);
		});
	};

	const updateBullets = (index) => {
		current = index;
		bullets.forEach((bullet, i) => {
			bullet.classList.toggle("bullet--active", i === current);
		});
	};

	const scrollToSection = (index) => {
		if (index < 0 || index >= sections.length) return;

		isScrolling = true;
		current = index;

		sections[index].scrollIntoView({ behavior: "smooth", block: "start" });
		updateBullets(index);

		setTimeout(() => {
			isScrolling = false;
		}, 1200);
	};

	const isScrollAtBottom = () => container.scrollTop + container.clientHeight >= container.scrollHeight - 10;
	const isScrollAtTop = () => container.scrollTop <= 10;

	const handleWheel = (e) => {
		if (isScrolling || Math.abs(e.deltaY) < 10) return;

		if (e.deltaY > 0) {
			if (isScrollAtBottom() && current < sections.length - 1) {
				e.preventDefault();
				scrollToSection(current + 1);
			}
		} else {
			if (isScrollAtTop() && current > 0) {
				e.preventDefault();
				scrollToSection(current - 1);
			}
		}
	};

	const observeSections = () => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = [...sections].indexOf(entry.target);
						updateBullets(index);
					}
				});
			},
			{
				root: container,
				rootMargin: "-100px 0px -99% 0px",
				threshold: 0,
			},
		);

		sections.forEach((section) => observer.observe(section));
	};

	const init = () => {
		createBullets();
		observeSections();
		container.addEventListener("wheel", handleWheel, { passive: false });
	};

	init();
};

const initFullPageScroll = () => {
	const SELECTORS = {
		sectionsSelector: ".js-section",
		bulletsSelector: ".js-bullets",
		containerSelector: ".js-page",
	};

	fullPageScroll({
		sectionsSelector: SELECTORS.sectionsSelector,
		bulletsSelector: SELECTORS.bulletsSelector,
		containerSelector: SELECTORS.containerSelector,
	});
};

// ____________ main ____________

const main = () => {
	initFullPageScroll();
};

window.onload = () => {
	main();
};
