Vue.component('Members', {
  props: ['items', 'id', 'lang', 'dict'],
  data() {
    return {
      people: {},
      baseUrl: process.env.BASE_URL,
    }
  },
  async created() {
    const self = this
    await axios.get(this.baseUrl + '/data/people2.json').then(function (res) {
      self.people = res.data
    })
  },
  methods: {
    $t(data) {
      if (this.dict[data]) {
        return this.dict[data]
      } else {
        return data
      }
    },
  },

  template: `<div>
    <h2 class="h03">{{$t("スタッフ・専攻テーマ")}}</h2>
    <div v-for="(obj, index) in items" :key="index" class="mb-5">
      <h3 class="h04" v-if="obj.label">{{lang == "ja" ? obj.label : obj.en}}</h3>
      <div v-for="(person, index2) in obj.children" :key="index2" class="mb-5 frame01">
        <template v-if="people[person]">
          <member
            :person="people[person]"
            :id="id"
            :lang="lang"
            :dict="dict"
          />
        </template>
      </div>
    </div>
  </div>`,
})
