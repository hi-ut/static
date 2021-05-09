Vue.component("Layout", {
  props: {
    title: { default: '', type: String },
    index: { default: -1, type: Number },
    lang: { default: '', type: String },
    breadcrumbs: { default: () => [], type: Array },
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      dataUrl: process.env.DATA_URL,
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
    await axios.get(this.dataUrl + `/assets/json/lang/${this.lang}.json`).then(function (res) {
      self.langMap = res.data;
    });

    await axios.get(this.dataUrl + "/assets/json/menuList.json").then(function (res) {
      self.menuList = res.data;
    });

    
  },
  async mounted() {
    this.lg = this.getLg();
    window.addEventListener("scroll", this.scrollWindow);
    window.addEventListener("resize", this.handleResize);
  },
  computed: {
    menu() {
      if(this.menuList[this.index]){
        return this.menuList[this.index]
      } else {
        return {}
      }
    },
    keyStr() {
     return this.menu.label
    },
    breadcrumbItems() {
      const breadcrumbItems = [
        {
          text: 'HOME',
          disabled: false,
          to: this.localePath({name : "index"})
        },
      ]

      const breadcrumbs = this.breadcrumbs

      for (let i = 0; i < breadcrumbs.length; i++) {
        const breadcrumb = breadcrumbs[i]
        breadcrumbItems.push({
          text: this.$t(breadcrumb.text), // 'HOME',
          disabled: false,
          to: this.localePath({name : breadcrumb.name})
        })
      }

      breadcrumbItems.push({
        text: this.$t(this.title),
      })

      return breadcrumbItems
    },
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

      let path = data.name

      if (data.params) {
        const params = data.params;
        for (let key in params) {
          path = path.replace("-" + key, "-" + params[key]);
        }
      }

      path = path.replace("index", "")
      .replace("slug", "")
      .replace("-", "/")

      let url =
        this.baseUrl + "/" + (this.lang === "en" ? "en/" : "") + path;


      return url;
    },

    getHiPath(data) {
      data = data[this.lang]
      if (data.includes("hi.u-tokyo.ac.jp")) {
        return data;
      }
    },
    
    //翻訳
    $t(data) {
      if (this.langMap[data]) {
        return this.langMap[data];
      } else {
        return data;
      }
    },
    
    //言語切り替え
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
                :src="dataUrl + '/assets/img/common/hilogo.jpg'"
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

          <li v-if="menuMapLv1.lang.includes(lang) && menuMapLv1.isDisplayTop" :key="key">
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
                    <template v-if="menuMapLv2.href">
                      <a :href="getHiPath(menuMapLv2.href)">{{
                        $t(menuMapLv2.label)
                      }}</a>
                    </template>
                    <template v-else>
                      <a :href="localePath(menuMapLv2.to)">{{
                        $t(menuMapLv2.label)
                      }}</a>
                    </template>
                    
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
          </li>
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

  <div>
    <div class="key-common">
      <div class="inner">
        <p class="ttl">{{ $t(keyStr) }}</p>
      </div>
    </div>

    <div class="breadcrumb">
      <ul>
        <li v-for="(item, key) in breadcrumbItems" :key="key">
          <template v-if="item.to">
            <a :href="item.to">{{ item.text }}</a>
          </template>
          <template v-else>
            {{ item.text }}
          </template>
        </li>
      </ul>
    </div>

    <div class="contents-wrap">
      <main id="main-contents" class="main-contents">
        <!-- InstanceBeginEditable name="main" -->
        <section>

        <h1 class="h02">{{title}}</h1>
          <slot />
        </section>
      </main>

      <div id="sidebar">
        <aside>
          <!-- InstanceBeginEditable name="sub" -->
          <nav>
            <h2>{{ $t(keyStr) }}</h2>
            <ul>
              <template v-for="(obj, index) in menu.children">
                <li v-if="obj.lang.includes(lang)" :key="index">
                  <a
                    :key="'parent_' + index"
                    :class="title == obj.label ? 'current' : ''"
                    :href="obj.to ? localePath(obj.to) : getHiPath(obj.href)"
                    exact
                  >
                    {{ $t(obj.label) }}
                  </a>
              
                  <ul>
                    <template v-for="(obj2, index2) in obj.children">
                      <li
                        v-if="obj2.lang.includes(lang)"
                        :key="index2"
                        >
                        <template v-if="obj2.to">
                          <a :key="index2" :href="localePath(obj2.to)">
                            {{ $t(obj2.label) }}
                          </a>
                        </template>
                        <template v-else>
                          <a
                            :key="'parent_' + index"
                            :class="title == obj2.label ? 'current' : ''"
                            :href="getHiPath(obj2.href)"
                            exact
                          >
                            {{ $t(obj2.label) }}
                          </a>
                        </template>
                      </li>
                    </template>
                  </ul>
                </li>
              </template>
            </ul>
          </nav>
          <!-- InstanceEndEditable -->
        </aside>
      </div>
    </div>
  </div>

  <footer id="footer">
    <transition name="button">
      <a v-show="isPageTopBtnActive" id="page-top" @click="returnTop"></a>
    </transition>
    <div class="inner">
      <div class="foot-add">
        <p class="logo">
          <a :href="localePath({ name: 'index' })"
            ><img
              :src="dataUrl + '/assets/img/common/logo_foot.png'"
              alt="東京大学史料編纂所 Historiographical Institute The University of Tokyo"
          /></a>
        </p>
        <p>
          <template v-if="lang == 'ja'">
            東京大学史料編纂所 所長：本郷 恵子<br />
            所在地：〒113-0033 東京都文京区本郷７丁目３番１号
          </template>
          <template v-else>
          Director : Hongo, Keiko<br />
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
