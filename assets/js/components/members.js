Vue.component('Members', {
  props: ["id", "lang"],
  data() {
    return {
      people: [],
      langMap: {},
      order: [],
      baseUrl: process.env.BASE_URL,
      dataUrl: process.env.DATA_URL,
      peopleByPostionMap: {}
    }
  },
  async created() {
    const self = this
    await axios.get(this.dataUrl + `/assets/json/lang/${this.lang}.json`).then(function (res) {
      self.langMap = res.data;
    });

    await axios.get(this.dataUrl + '/assets/json/faculty/facultyList.json').then(function (res) {
      const peopleList = res.data
      const people = {}
      for(const obj of peopleList){
        people[obj.slug] = obj
      }
      self.people = people
    })

    await axios.get(this.dataUrl + `/assets/json/faculty/${this.id}.json`).then(function (res) {
      self.order = res.data
    })

    //日本語出ない場合は、職位で並び替え
    if(this.lang !== "ja"){
      const positionArray = ["教授", "准教授", "助教", "特任助教", "客員教授"]

      const order = this.order
      let flatOrder = []
      for(const o of order){
        flatOrder = flatOrder.concat(o.id.split("|"))
      }

      const people = this.people

      const peopleByPostionMap = {}
      for(const p of positionArray){
        peopleByPostionMap[p] = []
      }
      
      for(const id of flatOrder){
        const p = people[id].position

        if(!peopleByPostionMap[p].includes(id)){
          peopleByPostionMap[p].push(id)
        } 
      }

      this.peopleByPostionMap = peopleByPostionMap
    }
  },
  methods: {
    $t(data) {
      if (this.langMap[data]) {
        return this.langMap[data]
      } else {
        return data
      }
    },
    localePath(data) {
      return this.baseUrl + '/' + data.name.replace('-', '/')
    },
    test(item){
      console.log(item)
    },
    elog(err){
      console.log({err})
    }
  },
  template: `<div>
    <h2 class="h03">{{$t("スタッフ・専攻テーマ")}}</h2>
    <template v-if="lang === 'ja'">
      <div v-for="(obj, key) in order" :key="key" class="mb-5">
        <h3 class="h04">{{obj.room}}</h3>
        <template v-for="(index, key2) in obj.id.split('|')">
          <template v-if="people[index]">
            <div :key="key2" class="mb2 frame01">
              <div>
                <span class="mr1">{{$t(people[index].position)}}</span>
                <template v-if="people[index].url">
                  <a :href="people[index].url">
                    {{$t(people[index].surname)}} {{$t(people[index].forename)}}
                  </a>
                </template>
                <template v-else>
                  {{$t(people[index].surname)}} {{$t(people[index].forename)}}
                </template>
              </div>
              
              <template v-if="people[index].also !== ''">
                <div v-for="(value, key3) in people[index].also.split('|')" :key="key3" v-if="value !== id">
                  （
                  <a :href="localePath({name: value})">
                    {{$t(value)}}
                  </a>
                  を兼任）
                </div>
              </template>
              <div v-if="people[index].main !== id">
                （
                <a :href="localePath({name: people[index].main})">
                {{$t(people[index].main)}}
                </a>
                より兼任）
              </div>
              <ul v-if="people[index].research">
                <li v-for="(value, key3) in people[index].research.split('|')">{{value}}</li>
              </ul>
            </div>
          </template>
          <template v-else>
            {{elog(index)}}
          </template>
        </template>
      </div>
    </template>
    <template v-else>
      <template v-for="(arr, p) in peopleByPostionMap">
        <div v-for="(index, key2) in arr" :key="p+key2" class="mb1 frame01">
          <div>
            <template v-if="people[index].url">
              <a :href="people[index].url">
                {{$t(people[index].surname_en)}} {{$t(people[index].forename_en)}}
              </a>
            </template>
            <template v-else>
              {{$t(people[index].surname_en)}} {{$t(people[index].forename_en)}}
            </template>, {{$t(people[index].position)}}
          </div>
          <template v-if="people[index].also !== ''">
            <div v-for="(value, key3) in people[index].also.split('|')" :key="key3" v-if="value !== id">
              （Also 
              <a :href="localePath({name: value})">
                {{$t(value)}}
              </a>）
            </div>
          </template>
          <template v-if="people[index].main !== id">
            <div>
              （Also 
              <a :href="localePath({name: people[index].main})">
              {{$t(people[index].main)}}
              </a>）
            </div>
          </template>
        </div>
      </template>
    </template>
  </div>`,
})
