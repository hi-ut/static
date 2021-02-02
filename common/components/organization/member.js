Vue.component('Member', {
  props: ['person', 'id', 'lang', 'dict'],
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      organization: {},
    }
  },
  async created() {
    const self = this
    await axios
      .get(this.baseUrl + '/data/organization.json')
      .then(function (res) {
        self.organization = res.data
      })
  },
  methods: {
    localePath(data) {
      return this.baseUrl + '/' + data.name.replace('-', '/')
    },
    $t(data) {
      if (this.dict[data]) {
        return this.dict[data]
      } else {
        return data
      }
    },
  },
  template: `<div v-if="person" flat outlined>
    <template v-if="lang == 'ja'">
      {{ $t(person.position) }}
    </template>
    <template v-if="person.url">
      <a :href="person.url">{{ lang == 'ja' ? person.name_ja : person.name_en }}</a>
      <v-icon v-if="false">mdi-open-in-new</v-icon>
    </template>
    <template v-else>
      {{ lang == 'ja' ? person.name_ja : person.name_en }}
    </template>
    <template v-if="lang == 'en'">
      , {{ $t(person.position) }}
    </template>
    <template v-if="person.attribution">（{{$t(person.attribution)}}）</template>
<!-- ... より兼任 --><template v-if="person.main && person.main !== id">
  <template v-if="lang == 'ja'">
    <br /><span class="ml-4"
      >（<a
      :href="
        localePath({name: person.main})
      "
      >{{ (organization[person.main]) }}</a
    >より兼任）</span
    >
  </template> <template v-else>
    <br /><span class="ml-4"
    >（Also <a
    :href="
      localePath({name: person.main})
    "
    >{{ $t(organization[person.main]) }}</a
  >）</span
  >
</template> </template>
<!-- ... を兼任 --><template v-if="person.also && person.also">
  <div v-for="(value, index3) in person.also" :key="index3">
    <template v-if="value !== id">
      <template v-if="lang == 'ja'">
        <span class="ml-4"
          >（<a
            :href="
        localePath({name: value})
      "
            >{{ (organization[value]) }}</a
          >を兼任）</span
        >
      </template> <template v-else>
        <span class="ml-4"
          >（Also <a
            :href="
        localePath({name: value})
      "
            >{{ $t(organization[value]) }}</a
          >）</span
        >
      </template> </template>
</div>
</template>
<ul v-if="lang == 'ja'" class="ml-4">
<li v-for="(res, index3) in person.researches" :key="index3">□ <template v-if="res.url">
      <a :href="res.url">{{ res.ja }}</a>
      <v-icon v-if="false">mdi-open-in-new</v-icon>
    </template> <template v-else>
      {{ res.ja }}
    </template> </li>
</ul>
</div>`,
})
