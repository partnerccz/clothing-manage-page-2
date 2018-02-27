<template>
  <div>
    <table-search></table-search>
    <table-list></table-list>
  </div>
</template>

<script>
import tableSearch from './Search'
import tableList from './List'

export default {
  name: 'test',
  components: {
    tableSearch,
    tableList
  }
}
</script>
