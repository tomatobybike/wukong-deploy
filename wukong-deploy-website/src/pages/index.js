import Link from '@docusaurus/Link';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import Particles from 'react-tsparticles';

import en from './home.en.json';
import zh from './home.zh.json';
import styles from './styles.module.css';

export default function Home() {
  const { i18n } = useDocusaurusContext();
  const { withBaseUrl } = useBaseUrlUtils();

  const locale = i18n.currentLocale;
  const text = locale === 'zh' ? zh : en;

  const [particleColor, setParticleColor] = useState('#888888');

  useEffect(() => {
    setParticleColor(locale === 'zh' ? '#888888' : '#555555');
  }, [locale]);

  // 切换语言（通过 URL 跳转）
  // 切换语言（通过 URL 跳转）
  const toggleLocale = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    const { pathname } = window.location;

    // 识别 baseUrl（比如 /wukong-deploy/）
    const baseUrl = window.location.pathname.includes('/wukong-deploy/') ? '/wukong-deploy' : '';

    let newPath;

    // 首页路径判断
    if (
      pathname === `${baseUrl}/` ||
      pathname === `${baseUrl}/zh/` ||
      pathname === `${baseUrl}/en/`
    ) {
      newPath = `${baseUrl}/${newLocale}/`;
    } else {
      // 其他页面保留路径，只替换语言部分
      newPath = pathname.replace(new RegExp(`^${baseUrl}/(zh|en)`), `${baseUrl}/${newLocale}`);
    }

    window.location.href = newPath;
  };

  // 切换暗黑模式
  const toggleDarkMode = () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') || 'light';
    root.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={styles.hero}>
      {/* 粒子背景 */}
      <Particles
        className={styles.particles}
        options={{
          fpsLimit: 60,
          particles: {
            number: { value: 50 },
            color: { value: particleColor },
            shape: { type: 'circle' },
            opacity: { value: 0.2 },
            size: { value: { min: 1, max: 3 } },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              outMode: 'bounce',
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'repulse' },
              onClick: { enable: true, mode: 'push' },
            },
            modes: { repulse: { distance: 100 }, push: { quantity: 4 } },
          },
          detectRetina: true,
        }}
      />

      {/* 右上角按钮 */}
      <div className={styles.topRightButtons}>
        <button className={styles.iconButton} onClick={toggleLocale} title="切换语言">
          🌐
        </button>
        <button className={styles.iconButton} onClick={toggleDarkMode} title="切换暗黑模式">
          🌓
        </button>
        <a
          className={styles.iconButton}
          href="https://github.com/tomatobybike/wukong-deploy"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
        >
          <img src={withBaseUrl('img/github.svg')} alt="GitHub" style={{ width: 24, height: 24 }} />
        </a>
      </div>

      <header className={styles.heroBanner}>
        <img src={withBaseUrl('img/logo.svg')} alt="wukong-deploy Logo" className={styles.logo} />
        <h1 className="hero__title">{text.title}</h1>
        <p className="hero__subtitle">{text.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/getting-started/introduction">
            {text.buttons.getStarted}
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/tomatobybike/wukong-deploy"
          >
            {text.buttons.github}
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.features} id="features">
          {text.features.map((f, idx) => (
            <div
              key={idx}
              className={clsx(
                styles.feature,
                styles.fadeIn,
                idx === 1 ? styles.delay1 : idx === 2 ? styles.delay2 : ''
              )}
            >
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </section>

        <section className={styles.install} id="install">
          <h2>{text.installTitle}</h2>
          <pre>
            <code>{text.installCommand}</code>
          </pre>
        </section>

        <section className={styles.demo}>
          <h2>{text.demoTitle}</h2>
          <img src={withBaseUrl('img/demo.svg')} alt="Demo" className={styles.demoGif} />
        </section>
      </main>
    </div>
  );
}
