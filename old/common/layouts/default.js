Vue.component("Layout", {
  props: ["lang"],
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      isPageTopBtnActive: false,

      isMobileMenuOpen: false,
      lg: true,
      langMap: {},
      menuList: [],
      isOpenLanguageSelection: false,
      currentLv1Index: -1,
      currentLv2Index: -1,

      isOpenLv1: false,
      isOpenLv2: false,
    };
  },
  async created() {
    const self = this;
    await axios.get(this.baseUrl + "/data/lang/ja.json").then(function (res) {
      self.langMap = res.data;
    });

    await axios.get(this.baseUrl + "/data/data.json").then(function (res) {
      self.menuList = res.data;
    });
  },
  async mounted() {
    this.lg = this.getLg();
    window.addEventListener("scroll", this.scrollWindow);
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    clickLv1Menu(index) {
      const currentLv1Index = this.currentLv1Index;
      if (currentLv1Index !== index) {
        this.isOpenLv1 = true;
      } else {
        this.isOpenLv1 = !this.isOpenLv1;
      }
      this.currentLv1Index = index;
    },

    clickLv2Menu(index) {
      const currentLv2Index = this.currentLv2Index;
      if (currentLv2Index !== index) {
        this.isOpenLv2 = true;
      } else {
        this.isOpenLv2 = !this.isOpenLv2;
      }
      this.currentLv2Index = index;
    },

    getLg() {
      return window.innerWidth > 769;
    },

    handleResize() {
      // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      this.lg = this.getLg();
    },

    returnTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    scrollWindow() {
      const top = 100; // ボタンを表示させたい位置
      if (top <= 0) {
        this.isPageTopBtnActive = true;
      } else {
        this.isPageTopBtnActive = false;
      }
    },

    localePath(data) {
      let url =
        this.baseUrl + "/" + (this.lang === "en" ? "en/" : "") + data.name;

      if (data.params) {
        const params = data.params;
        for (let key in params) {
          url = url.replace("-" + key, "-" + params[key]);
        }
      }

      url = url
        .replace("u-tokyo", "utokyo")
        .replace("index", "")
        .replace("slug", "")
        .replace("-", "/")
        .replace("utokyo", "u-tokyo");

      return url;
    },

    getHiPath(data) {
      if (data.includes("hi.u-tokyo.ac.jp")) {
        return data;
      }

      return this.baseUrl + "/" + (this.lang == "en" ? "en/" : "") + data + "/";
    },

    $t(data) {
      if (this.langMap[data]) {
        return this.langMap[data];
      } else {
        return data;
      }
    },

    changeLocale(lang) {
      if (lang === "ja") {
        location.href = this.baseUrl + "/";
      } else {
        location.href = this.baseUrl + "/" + lang + "/";
      }
    },
  },
  template: `
    <div :class="isMobileMenuOpen ? 'gnav-open' : ''">
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
                :src="baseUrl + '/img/icons/hilogo.jpg'"
                alt="東京大学史料編纂所 Historiographical Institute The University of Tokyo"
              />
            </a>
          </h1>
          </div>
          <template v-if="lg">
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
              <input id="search-btn" type="submit" name="sa" value=" " />
            </form>

            <ul
    class="lang-select"
    @click="isOpenLanguageSelection = !isOpenLanguageSelection"
  >
    <li>
      <span>Language</span>
        <transition name="slide">
        <ul v-show="isOpenLanguageSelection" class="child" style="display: block;"> 
          <li v-if="lang !== 'ja'">
            <a @click="changeLocale('ja')">日本語</a>
          </li>
          <li v-if="lang !== 'en'">
            <a @click="changeLocale('en')">English</a>
          </li>
          <!-- 
            <li><a :href="baseUrl + '/zh/'">中文</a></li>
            <li><a :href="baseUrl + '/ko/'">한국어</a></li> 
          -->
        </ul>
        </transition>
    </li>
  </ul>
          </template>
          <!-- 開閉用ボタン -->
          <div id="js__sideMenuBtn" class="nav_toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
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

      <form v-if="isMobileMenuOpen" id="cse-search-box" action="https://google.com/cse">
          <input type="hidden" name="cx" value="xxx" />
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

        <ul class="menu">
          <template v-for="(menuMapLv1, key) in menuList">
            <template
              v-if="
                (menuMapLv1.to || menuMapLv1.href) &&
                !['ニュース', 'よくあるご質問'].includes(menuMapLv1.label)
              "
            >
            <li v-if="menuMapLv1.lang.includes(lang)" :key="key">
            <template v-if="menuMapLv1.href">
              <a :href="getHiPath(menuMapLv1.href)">{{
                $t(menuMapLv1.label)
              }}</a>
            </template>

            <template v-else>
              <span class="atag" @click="clickLv1Menu(key)">{{
                $t(menuMapLv1.label)
              }}</span>

              <i class="child-btn" @click="clickLv1Menu(key)"></i>
              
              <transition name="slide">
              <ul
                :duration="500"
                v-show="isOpenLv1 && currentLv1Index === key"
                class="sub-menu"
                style="display: block"
              >
                <template v-for="(menuMapLv2, key2) in menuMapLv1.children">
                  <li
                    v-if="menuMapLv2.lang.includes(lang)"
                    :key="key2"
                    :class="
                      isOpenLv2 && currentLv2Index === key2
                        ? 'child-open'
                        : ''
                    "
                  >
                    <a :href="localePath(menuMapLv2.to)">{{
                      $t(menuMapLv2.label)
                    }}</a>
                    <template v-if="menuMapLv2.children">
                      <i class="child-btn" @click="clickLv2Menu(key2)"></i>
                      <transition name="slide">
                      <ul
                        :duration="500"
                        v-show="isOpenLv2 && currentLv2Index === key2"
                        class="sub-menu2"
                        style="display: block"
                      >
                        <template
                          v-for="(menuMapLv3, key3) in menuMapLv2.children"
                        >
                          <li
                            v-if="menuMapLv3.lang.includes(lang)"
                            :key="key3"
                          >
                            <template v-if="menuMapLv3.href">
                              <a :href="getHiPath(menuMapLv3.href)">{{
                                $t(menuMapLv3.label)
                              }}</a>
                            </template>
                            <template v-else>
                              <a :href="localePath(menuMapLv3.to)">{{
                                $t(menuMapLv3.label)
                              }}</a>
                            </template>
                          </li>
                        </template>
                      </ul>
                      </transition>
                    </template>
                  </li>
                </template>
              </ul>
              </transition>
            </template>
          </li>
            </template>
          </template>
          
        </ul>

        <ul
        v-if="isMobileMenuOpen"
    class="lang-select"
    @click="isOpenLanguageSelection = !isOpenLanguageSelection"
  >
    <li>
      <span>Language</span>
        <template>
        <ul v-show="isOpenLanguageSelection" class="child" style="display: block;"> 
          <li v-if="lang !== 'ja'">
            <a @click="changeLocale('ja')">日本語</a>
          </li>
          <li v-if="lang !== 'en'">
            <a @click="changeLocale('en')">English</a>
          </li>
          <!-- 
            <li><a :href="baseUrl + '/zh/'">中文</a></li>
            <li><a :href="baseUrl + '/ko/'">한국어</a></li> 
          -->
        </ul>
        </template>
    </li>
  </ul>
      </nav>
    </div>


  <slot />

    <footer id="footer">
      <transition name="button">
        <a v-show="isPageTopBtnActive" id="page-top" @click="returnTop"></a>
      </transition>
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
            <template v-if="lang == 'ja'">
              東京大学史料編纂所 所長：保谷 徹<br />
              所在地：〒113-0033 東京都文京区本郷７丁目３番１号
            </template>
            <template v-else>
            Director : Hoya, Toru<br />
              Address: 3-1, Hongo 7-chome, Bunkyo-ku, Tokyo 113-0033, JAPAN
            </template>
          </p>
          <br />
          <p class="contct">
            <a class="btn01 v3" :href="localePath({ name: 'inquery' })"
              >{{$t("お問い合わせ")}}</a
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
                  >■ {{$t("お問い合わせ")}}</a
                >
              </li>
            </ul>
            <ul>
              <li>
                <a :href="localePath({ name: 'about-sitemap' })"
                  >■ {{$t("サイトマップ")}}</a
                >
              </li>
              <li>
                <a :href="localePath({ name: 'about-link' })"
                  >■ {{$t("リンク")}}</a
                >
              </li>
              <li>
                <a :href="localePath({ name: 'about-access' })"
                  >■ {{$t("アクセスマップ")}}</a
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
});
