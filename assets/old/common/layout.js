Vue.component('Layout', {
  props: ['lang', 'dict', 'menu'],
  data() {
    return {
      langStr: this.lang === 'ja' ? '日本語' : 'English',
      baseUrl: process.env.BASE_URL,
      buttonActive: false,
      scroll: 0,
      isMobileMenuOpen: false,
      lg: true
    }
  },
  mounted() {
    this.lg = this.getLg()
    window.addEventListener('scroll', this.scrollWindow)
    window.addEventListener('resize', this.handleResize)
  },
  computed: {
    items() {
      return this.menu
    },
  },
  methods: {
    getLg() {
      return window.innerWidth > 769
    },

    handleResize() {
      // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      this.lg = this.getLg()
    },

    returnTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  
    scrollWindow() {
      const top = 100 // ボタンを表示させたい位置
      this.scroll = window.scrollY
      if (top <= this.scroll) {
        this.buttonActive = true
      } else {
        this.buttonActive = false
      }
    },

    localePath(data) {
      let url  = this.baseUrl + '/' + (this.lang === "en" ? "en/" :  "") + 
      data.name

      if(data.params){
        const params = data.params
        for(let key in params){
          url = url.replace("-" + key, "-" + params[key])
        }
      }

      url = url.replace("u-tokyo", "utokyo").replace("index", "").replace("slug", "").replace("-", "/").replace("utokyo", "u-tokyo")

      return url
    },
    getHiPath(data){
      if(data.includes("hi.u-tokyo.ac.jp")){
        return data
      }
      
      return this.baseUrl + '/' + (this.lang == "en" ? "en/" :  "") + data + "/"
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
          <template v-for="(item, key) in items">
            <template
              v-if="
                (item.to || item.href) &&
                item.label != 'ニュース' &&
                item.label != 'よくあるご質問'
              "
            >
              <template v-if="item.to || item.href">
                <li v-if="item.lang.includes(lang)" :key="key">
                  <template v-if="item.href">
                    <a :href="getHiPath(item.href)">{{ $t(item.label) }}</a>
                  </template>

                  <template v-else>
                    <a :href="localePath(item.to)">{{
                      $t(item.label)
                    }}</a>
                    
                  </template>
                </li>
              </template>
            </template>
          </template>
          
        </ul>

        <ul v-if="isMobileMenuOpen" class="lang-select">
          <li class="en">
            <a v-if="langStr == '日本語'" :to="switchLocalePath('en')"
              >English</a
            >
            <a v-else :to="switchLocalePath('ja')">日本語</a>
          </li>
        </ul>
      </nav>
    </div>


  <slot />

    <footer id="footer">
      <transition name="button">
        <a v-show="buttonActive" id="page-top" @click="returnTop"></a>
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
})
