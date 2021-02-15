Vue.component('LayoutAbout', {
  props: {
    title: { default: '', type: String },
    index: { default: -1, type: Number },
    lang: { default: '', type: String },
    dict: { default: () => {}, type: Object },
    menu: { default: () => [], type: Array },
    breadcrumbs: { default: () => [], type: Array },
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
    }
  },
  computed: {
    label() {
      return this.menu[this.index].label
    },
    items() {
      const items = [
        {
          text: 'HOME',
          disabled: false,
          to: this.localePath({name : "index"})
        },
      ]

      const breadcrumbs = this.breadcrumbs
      for (let i = 0; i < breadcrumbs.length; i++) {
        const breadcrumb = breadcrumbs[i]
        items.push({
          text: breadcrumb.text, // 'HOME',
          disabled: false,
          to: this.localePath({name : breadcrumb.name})
        })
      }

      items.push({
        text: this.$t(this.title),
      })

      return items
    },
  },
  methods: {
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
    getHiUrl(data){
      if(data.includes("hi.u-tokyo.ac.jp")){
        return data
      }
      return this.baseUrl + '/' + (this.lang == "en" ? "en/" :  "") + data + "/"
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
      <div class="key-common">
        <div class="inner">
          <p class="ttl">{{ $t(label) }}</p>
        </div>
      </div>

      <div class="breadcrumb">
        <ul>
          <li v-for="(item, key) in items" :key="key">
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
              <h2>{{ $t(label) }}</h2>
              <ul>
                <template v-for="(obj, index) in menu[index].children">
                  <li v-if="obj.lang.includes(lang)" :key="index">
                      <a
                        :key="'parent_' + index"
                        :class="title == obj.label ? 'current' : ''"
                        :href="obj.to ? localePath(obj.to) : getHiUrl(obj.href)"
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
                              :href="getHiUrl(obj2.href)"
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
      `,
})
