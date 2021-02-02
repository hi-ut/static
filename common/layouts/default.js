Vue.component('Layout', {
  props: ['lang', 'dict', 'menu'],
  data() {
    return {
      langStr: this.lang === 'ja' ? '日本語' : 'English',
      baseUrl: process.env.BASE_URL,
    }
  },
  computed: {
    items() {
      return this.menu
    },
  },
  methods: {
    localePath(data) {
      return this.baseUrl + '/' + (this.lang == "en" ? "en/" :  "") + data.name.replace('-', '/').replace("index", "")
    },
    switchLocalePath(lang) {
      return this.baseUrl + "/" + (lang == "en" ? "en/" :  "")
    },
    $t(data) {
      if (this.dict[data]) {
        return this.dict[data]
      } else {
        return data
      }
    },
  },
  template: `
    <div>
    <!-- InstanceBeginEditable name="bodyTop" --><!-- InstanceEndEditable -->
    <!-- サイドオープン時メインコンテンツを覆う -->
    <div id="js__overlay" class="overlay"></div>
    <!-- メインコンテンツ -->
    <div id="wrapper" class="wrapper">
      <!-- InstanceBeginEditable name="pageImg" --><!-- InstanceEndEditable -->
      <header id="header">
        <div class="header-inner">
          <div class="header-logo">
          <h1>
            <a :href="localePath({ name: 'index' })">
              <img
                :src="baseUrl + '/img/icons/hilogo.png'"
                alt="東京大学史料編纂所 Historiographical Institute The University of Tokyo"
              />
            </a>
          </h1>
          </div>
          <form id="cse-search-box" action="https://google.com/cse">
            <input type="hidden" name="cx" value="1e10e2c945c90dfeb" />
            <input type="hidden" name="ie" value="UTF-8" />
            <input
              id="search-box"
              type="text"
              name="q"
              size="31"
              placeholder="Googleカスタム検索"
            />
            <input id="search-btn" type="submit" name="sa" value="" />
          </form>

          <ul class="lang-select">
            <li class="en">
              <a v-if="langStr == '日本語'" :href="switchLocalePath('en')"
                >English</a
              >
              <a v-else :href="switchLocalePath('ja')">日本語</a>
            </li>
          </ul>
          <!-- 開閉用ボタン -->
          <div id="js__sideMenuBtn" class="nav_toggle">
            <div class="ellipsis-v">
              <span class="point top"></span> <span class="point mid"></span>
              <span class="point bot"></span>
            </div>
          </div>
        </div>
        <!-- .headerInner -->
      </header>
      <!-- グローバルナビゲーション -->
      <nav id="js_gnav" class="gnav">
        <ul class="menu">
          <template v-for="(item, key) in menu">
            <li v-if="item.lang.includes(lang)" :key="key">
              <template v-if="item.label == 'データベース検索'">
                <a :href="item.href">{{ $t(item.label) }}</a>
              </template>

              <template v-else>
                <span class="atag">{{ $t(item.label) }}</span
                ><i class="child-btn"></i>
                <template v-if="item.to">
                  <ul class="sub-menu">
                    <template v-for="(child, key2) in item.children">
                      <li v-if="child.lang.includes(lang)" :key="key2">
                        <template v-if="child.to">
                          <!-- 要検討 -->
                          <a
                            v-if="child.to"
                            :href="localePath(child.to)"
                            >{{ $t(child.label) }}</a
                          >
                        </template>
                        <template v-else>
                          <a :href="child.href">{{ $t(child.label) }}</a>
                        </template>
                      </li>
                    </template>
                  </ul>
                </template>
                <template v-else>
                  <ul class="sub-menu">
                    <li>
                      <a :href="item.href">{{ $t(item.label) }}</a>
                    </li>
                  </ul>
                </template>
              </template>
            </li>
          </template>

          <template v-if="false">
            <li>
              <span class="atag">ご案内</span><i class="child-btn"></i>
              <ul class="sub-menu">
                <li><a href="about_hi/message-j.html">所長挨拶</a></li>
                <li><a href="about_hi/history-j.html">沿革</a></li>
                <li><a href="about_hi/mission-j.html">事業</a></li>
                <li>
                  <a href="about_hi/organization-j.html">組織</a
                  ><i class="child-btn"></i>
                  <ul class="sub-menu2">
                    <li><a href="kodai/index.html">古代史料部</a></li>
                    <li><a href="chusei/chusei.html">中世史料部</a></li>
                    <li><a href="kinsei/kinsei.html">近世史料部</a></li>
                    <li><a href="komo/komo.html">古文書古記録部</a></li>
                    <li><a href="tokushu/index.html">特殊史料部</a></li>
                    <li><a href="gazo/gazo.html">画像史料解析センター</a></li>
                    <li>
                      <a href="cdps/cdpsindex.html"
                        >近代日本史情報国際センター</a
                      >
                    </li>
                    <li><a href="faculty/index.html">教員一覧</a></li>
                    <li><a href="gijyutu/frtec.html">史料技術保存室</a></li>
                  </ul>
                </li>
                <li>
                  <a href="about_hi/facilities-finance.html">施設・財務</a>
                </li>
                <li>
                  <a href="about_hi/evaluation/evaluation.html">点検・評価</a>
                </li>
              </ul>
            </li>
            <li>
              <span class="atag">編纂・研究・公開</span
              ><i class="child-btn"></i>
              <ul class="sub-menu">
                <li>
                  <a href="publication/publication_top-j.html">編纂・出版</a
                  ><i class="child-btn"></i>
                  <ul class="sub-menu2">
                    <li>
                      <a href="publication/dainihonshiryo-shiryosoran-j.html"
                        >大日本史料・史料綜覧</a
                      >
                    </li>
                    <li>
                      <a href="publication/komonjo-j.html">大日本古文書</a>
                    </li>
                    <li>
                      <a href="publication/kokiroku-j.html">大日本古記録</a>
                    </li>
                    <li>
                      <a href="publication/kinsei-j.html">大日本近世史料</a>
                    </li>
                    <li>
                      <a href="publication/ishin-j.html">大日本維新史料</a>
                    </li>
                    <li>
                      <a href="publication/ishinkoyo-j.html">維新史料綱要</a>
                    </li>
                    <li>
                      <a href="publication/kaigai-j.html">日本関係海外史料</a>
                    </li>
                    <li>
                      <a href="publication/kaigaimokuroku-j.html"
                        >日本関係海外史料目録</a
                      >
                    </li>
                    <li>
                      <a href="publication/shosoin-j.html">正倉院文書目録</a>
                    </li>
                    <li>
                      <a href="publication/shoenezu-j.html">日本荘園絵図聚影</a>
                    </li>
                    <li><a href="publication/kao-j.html">花押かがみ</a></li>
                    <li>
                      <a href="publication/kakushu-j.html">その他の出版物</a>
                    </li>
                    <li><a href="publication/syoho-j.html">所報</a></li>
                    <li><a href="publication/kiyo-j.html">研究紀要</a></li>
                    <li>
                      <a href="gazo/centernewslist.htm">画像解析センター通信</a>
                    </li>
                  </ul>
                </li>
                <li><a href="investigation/saiho.html">史料調査</a></li>
                <li>
                  <a href="collaboration/collaboration-j.html">共同研究</a>
                </li>
                <li><a href="collaboration/fruits.html">各種成果</a></li>
                <li>
                  <a href="conference-seminar/conference-seminar-j.html"
                    >成果公開・教育</a
                  >
                </li>
              </ul>
            </li>
            <li>
              <span class="atag">史料の利用</span><i class="child-btn"></i>
              <ul class="sub-menu">
                <li><a href="tosho/tosho.html">お知らせ</a></li>
                <li>
                  <a href="tosho/etsuran.html">図書室利用案内（閲覧手続き）</a>
                </li>
                <li>
                  <a href="tosho/shiryoriyo.html"
                    >史料等利用案内（複製・掲載・放映手続き）</a
                  >
                </li>
                <li><a href="tosho/kensaku.html">所蔵史料の検索</a></li>
                <li><a href="tosho/toiawase.html">お問い合わせ・連絡先 </a></li>
              </ul>
            </li>
            <li>
              <a href="https://wwwap.hi.u-tokyo.ac.jp/ships/"
                >データベース検索</a
              >
            </li>
            <li>
              <span class="atag">所蔵史料紹介</span><i class="child-btn"></i>
              <ul class="sub-menu">
                <li><a href="collection/collection01-j.html">概要</a></li>
                <li><a href="collection/collection02-j.html">貴重書</a></li>
                <li><a href="collection/collection03-j.html">特殊蒐書</a></li>
                <li>
                  <a href="collection/collection04-j.html">その他の貴重書</a>
                </li>
                <li>
                  <a href="collection/degitalgallary.html"
                    >デジタルギャラリー</a
                  >
                </li>
              </ul>
            </li>
            <li><a href="exchange/exchange-j.html">国際交流</a></li>
          </template>
        </ul>
      </nav>
    </div>


  <slot />

    <footer id="footer">
      <a id="page-top" href="#wrapper"></a>
      <div class="inner">
        <div class="foot-add">
          <p class="logo">
            <a :href="localePath({ name: 'index' })"
              ><img
                :src="baseUrl + '/assets/img/common/logo_foot.png'"
                alt="東京大学史料編纂所 Historiographical Institute The University of Tokyo"
            /></a>
          </p>
          <p>
            東京大学史料編纂所 所長：保谷 徹<br />
            所在地：〒113-0033 東京都文京区本郷７丁目３番１号
          </p>
          <br />
          <p class="contct">
            <a class="btn01 v3" :href="localePath({ name: 'inquery' })"
              >お問い合わせ</a
            >
          </p>
        </div>
        <aside class="foot-nav">
          <nav>
            <ul>
              <li>
                <a :href="localePath({ name: 'index' })"
                  >■ HOME</a
                >
              </li>
              <li>
                <a href="https://cliocyb.hi.u-tokyo.ac.jp/">■ STAFF ONLY</a>
              </li>
              <li>
                <a :href="localePath({ name: 'inquery' })"
                  >■ お問い合わせ</a
                >
              </li>
            </ul>
            <ul>
              <li>
                <a :href="localePath({ name: 'about-sitemap' })"
                  >■ サイトマップ</a
                >
              </li>
              <li>
                <a :href="localePath({ name: 'about-link' })"
                  >■ リンク</a
                >
              </li>
              <li>
                <a :href="localePath({ name: 'about-access' })"
                  >■ アクセスマップ</a
                >
              </li>
            </ul>
          </nav>
          <small
            >Copyright © 1997 - 2020<br />
            Historiographical Institute The University of Tokyo ©
            東京大学</small
          >
        </aside>
      </div>
    </footer>

  </div>
     
      `,
})
