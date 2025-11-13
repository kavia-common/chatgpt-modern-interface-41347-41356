import React from 'react';
import './Hello.css';
import '../App.css';
import { getFigmaAsset } from '../utils/assetPath';

/**
 * PUBLIC_INTERFACE
 * Hello screen route translated from Figma assets (642:5347).
 * Renders a static, pixel-accurate layout using absolute positioning
 * and references images from public/figmaimages.
 */
function Hello() {
  return (
    <div id="screen-hello-642-5347" role="main" aria-label="Hello screen (Figma 642:5347)">
      <div className="cover" aria-hidden="false">
        {/* Left New Chat card */}
        <div className="left-newchat" aria-label="Left new chat card">
          <div className="inner">
            <div className="header">
              <img
                className="chatgpt-logo"
                src={getFigmaAsset('figma_image_642_9740_13762_121281.png')}
                alt="ChatGPT logo"
              />
              <div className="chatgpt-tag" aria-label="ChatGPT Plus badge">
                <span className="typo-29">Plus</span>
              </div>

              <div className="cols" role="group" aria-label="Three columns section">
                <div className="col examples" aria-label="Examples">
                  <div className="icon" aria-hidden="true"></div>
                  <div className="heading"><span className="typo-30">Examples</span></div>
                  <div className="chip i1"><span className="typo-31">"Explain quantum computing insimple terms"</span></div>
                  <div className="chip i2"><span className="typo-31">"Got any creative ideas for a 10year old's birthday?"</span></div>
                  <div className="chip i3"><span className="typo-31">"How do I make an HTTP requestin Javascript?"</span></div>
                </div>

                <div className="col capabilities" aria-label="Capabilities">
                  <div className="icon" aria-hidden="true"></div>
                  <div className="heading"><span className="typo-30">Capabilities</span></div>
                  <div className="chip i1"><span className="typo-31">Remembers what user saidearlier in the conversation.</span></div>
                  <div className="chip i2"><span className="typo-31">Allows user to provide follow-up corrections.</span></div>
                  <div className="chip i3"><span className="typo-31">Trained to decline inappropriate requests.</span></div>
                </div>

                <div className="col limitations" aria-label="Limitations">
                  <div className="icon" aria-hidden="true"></div>
                  <div className="heading"><span className="typo-30">Limitations</span></div>
                  <div className="chip i1"><span className="typo-31">May occasionally generate incorrect information.</span></div>
                  <div className="chip i2"><span className="typo-31">May occasionally produce harmful instructions or biased content.</span></div>
                  <div className="chip i3"><span className="typo-31">Limited knowledge of world andevents after 2021.</span></div>
                </div>
              </div>
            </div>

            <div className="input-frame">
              <div className="input" aria-label="Message input">
                <div className="left-icons" aria-hidden="true"></div>
                <div className="placeholder"><span className="typo-31">Type message</span></div>
                <div className="right-icon" aria-label="Send message icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Left Sidebar */}
        <div className="left-sidebar" aria-label="Left sidebar"></div>

        {/* Right New Chat card (dark) */}
        <div className="right-newchat" aria-label="Right new chat card">
          <div className="inner">
            <div className="header">
              <div className="chatgpt-tag" aria-label="ChatGPT Plus badge dark"><span className="typo-29">Plus</span></div>
              <div className="cols" role="group" aria-label="Three columns section dark">
                <div className="col examples" aria-label="Examples">
                  <div className="heading"><span className="typo-33">Examples</span></div>
                  <div className="chip i1"><span className="typo-24">"Explain quantum computing insimple terms"</span></div>
                  <div className="chip i2"><span className="typo-24">"Got any creative ideas for a 10year old's birthday?"</span></div>
                  <div className="chip i3"><span className="typo-24">"How do I make an HTTP requestin Javascript?"</span></div>
                </div>
                <div className="col capabilities" aria-label="Capabilities">
                  <div className="heading"><span className="typo-33">Capabilities</span></div>
                  <div className="chip i1"><span className="typo-24">Remembers what user saidearlier in the conversation.</span></div>
                  <div className="chip i2"><span className="typo-24">Allows user to provide follow-up corrections.</span></div>
                  <div className="chip i3"><span className="typo-24">Trained to decline inappropriate requests.</span></div>
                </div>
                <div className="col limitations" aria-label="Limitations">
                  <div className="heading"><span className="typo-33">Limitations</span></div>
                  <div className="chip i1"><span className="typo-24">May occasionally generate incorrect information.</span></div>
                  <div className="chip i2"><span className="typo-24">May occasionally produce harmful instructions or biased content.</span></div>
                  <div className="chip i3"><span className="typo-24">Limited knowledge of world andevents after 2021.</span></div>
                </div>
              </div>
            </div>

            <div className="input-frame">
              <div className="input" aria-label="Message input dark">
                <div className="placeholder"><span className="typo-24">Type message</span></div>
                <div className="right-icon" aria-label="Send message icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar" aria-label="Right sidebar"></div>

        {/* Features card */}
        <div className="features-card" aria-label="Features card">
          <div className="n18"><span className="typo-35">18</span></div>
          <div className="screens"><span className="typo-36">Screens</span></div>
        </div>
      </div>

      {/* Lower sections */}
      <div className="lower" aria-hidden="false">
        <div className="section more-pages" aria-label="More pages section">
          <div className="row">
            <div className="icon" aria-hidden="true"></div>
            <div className="title"><span className="typo-37">More pages ↗</span></div>
          </div>
        </div>

        <div className="section made-with" aria-label="Made with SnowUI section">
          <div className="row">
            <div className="icon">
              <img
                src={getFigmaAsset('figma_image_642_5359_11048_14274_10412_2364.png')}
                alt="SnowUI Icon"
                style={{ width: 80, height: 80, objectFit: 'contain' }}
              />
            </div>
            <div className="title"><span className="typo-37">Made with SnowUI ↗</span></div>
          </div>
        </div>

        <div className="section components" aria-label="See how components work section">
          <div className="row">
            <div className="icon" aria-hidden="true"></div>
            <div className="title"><span className="typo-37">See how components work ↗</span></div>
          </div>
        </div>

        <div className="about" aria-label="About me section">
          <div className="row">
            <div className="icon">
              <img
                src={getFigmaAsset('figma_image_642_5363.png')}
                alt="Avatar ByeWind"
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <div className="title"><span className="typo-37">About me</span></div>
          </div>
          <div className="desc">
            <span className="typo-23">
I’m ByeWind, a Product UX/UI Designer, based in China. I graduated
from art design in 2007 and have been engaged in product user experience
design for 17 years.

I have successively served technology companies such as Tencent and Alibaba,
and have been responsible for the design of more than 30 major projects.

Now I'm building SnowUI and trying to make it the best design system possible.


Contact: byewind@live.com or Twitter↗
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer" aria-label="Footer">
        <div className="brand">
          <div className="logo" aria-label="SnowUI brand">
            <div className="icon" aria-hidden="true"></div>
            <div className="text" aria-hidden="true"></div>
          </div>
        </div>
        <div className="copyright">
          <span className="typo-24">© 2025 SnowUI. All rights reserved.</span>
        </div>
        <div className="social" aria-label="Social links">
          <div className="s"><img src={getFigmaAsset('figma_image_647_6613.png')} alt="Twitter" /></div>
          <div className="s"><img src={getFigmaAsset('figma_image_647_6614.png')} alt="Instagram" /></div>
          <div className="s"><img src={getFigmaAsset('figma_image_647_6615_60755_5365_2654_424.png')} alt="Threads" /></div>
          <div className="s"><img src={getFigmaAsset('figma_image_647_6616_60755_5615.png')} alt="Dribbble" /></div>
          <div className="s"><img src={getFigmaAsset('figma_image_676_3297.png')} alt="Figma" /></div>
          <div className="s"><img src={getFigmaAsset('figma_image_676_370.png')} alt="Website" /></div>
        </div>
      </div>
    </div>
  );
}

export default Hello;
