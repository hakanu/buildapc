var _PROXY = 'https://api.paylas.io/api/proxy?url='
var _URLS = [
  _PROXY + 'https://www.reddit.com/r/buildapcsales.json',
  _PROXY + 'https://www.reddit.com/r/buildapcsalesuk.json',
  _PROXY + 'https://www.reddit.com/r/BaPCSalesEurope.json',
  _PROXY + 'https://www.reddit.com/r/bapcsalesgermany.json'
]

function getCategoryFromTitle(title) {
  // console.log('title: ' + title)
  if (!title) return 'null'

  if (title.toLowerCase().indexOf('gpu') >= 0 ||
      title.toLowerCase().indexOf('gtx') >= 0 ||
      title.toLowerCase().indexOf('radeon') >= 0 ||
      title.toLowerCase().indexOf('graphics card') >= 0 ||
      title.toLowerCase().indexOf('video card') >= 0 ||
      title.toLowerCase().indexOf('vega') >= 0 ) {
    return 'gpu'
  } else if (title.toLowerCase().indexOf('cpu') >= 0) {
    return 'cpu'
  } else if (title.toLowerCase().indexOf('psu') >= 0) {
    return 'psu'
  } else if (title.toLowerCase().indexOf('ram') >= 0) {
    return 'ram'
  } else if (title.toLowerCase().indexOf('mouse') >= 0) {
    return 'mouse'
  } else if (title.toLowerCase().indexOf('keyboard') >= 0) {
    return 'keyboard'
  } else if (title.toLowerCase().indexOf('monitor') >= 0) {
    return 'monitor'
  } else if (title.toLowerCase().indexOf('cooler') >= 0) {
    return 'cooler'
  } else if (title.toLowerCase().indexOf('ssd') >= 0) {
    return 'ssd'
  } else if (title.toLowerCase().indexOf('case') >= 0) {
    return 'case'
  } else if (title.toLowerCase().indexOf('router') >= 0) {
    return 'router'
  } else if (
    title.toLowerCase().indexOf('hdd') >= 0 ||
    title.toLowerCase().indexOf('hard disk') >= 0 ||
    title.toLowerCase().indexOf('harddisk') >= 0) {
    return 'hdd'
  } else if (
      title.toLowerCase().indexOf('mobo') >= 0 ||
      title.toLowerCase().indexOf('motherboard') >= 0 ||
      title.toLowerCase().indexOf('mother board') >= 0) {
    return 'motherboard'
  } else if (title.toLowerCase().indexOf('"') >= 0) {
    return 'monitor'
  } else {
    return 'unknown'
  }
}

var app = new Vue({
  el: '#app',
  data: {
    title: 'Build a pc',
    bacs: [],
    searchResultItems: [],
    searchQuery: ''
  },
  mounted: function(){
    console.log('Started...')
    this.fetchReddit(this.bacs)
  },
  methods: {
    fetchReddit: function(bacs) {
      for (var i = 0; i < _URLS.length; i++) {
        var url = _URLS[i]
        console.log('Fetching ' + url)
        $.get(url, function(resp) {
          if (!resp || !resp.data || !resp.data.children) {
            console.log('no items found in the reddit json')
            return;
          }
          var rawItems = resp.data.children
          var items = []
          for (var j = 0; j < rawItems.length; j++) {
            var item = rawItems[j]
            items.push({
              'title': item.data.title,
              'url': item.data.url,
              'category': getCategoryFromTitle(item.data.title)
            })
          }

          bacs.push({
            'title': url.substr(url.lastIndexOf('/'), url.lastIndexOf('.')),
            'items': items,
            'url': url
          })
        })
      }
    },
    searchItems: function() {
      console.log('Searcing for ' + this.searchQuery)
    }
  },
  computed: {
    // A computed property that holds only those articles that match the searchString.
    filteredItems: function () {
      console.log('Filtering for ' + this.searchQuery)
      // console.log(this.bacs)
      if(!this.searchQuery){
        return null
      }

      var searchQuery = this.searchQuery.trim().toLowerCase();

      var filteredItems = []
      
      for(var i = 0; i < this.bacs.length; i++) {
        var bac = this.bacs[i].items
        for(var j = 0; j < bac.length; j++) {
          var item = bac[j]
          if(item.title.toLowerCase().indexOf(searchQuery) !== -1 ||
             item.category.toLowerCase().indexOf(searchQuery) !== -1) {
            filteredItems.push(item)
          }
        }
      }
      console.log(filteredItems)

      // Return an array with the filtered data.
      return filteredItems
    }
  }
})
