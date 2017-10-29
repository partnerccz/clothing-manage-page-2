<template>
  <div>
    <table-search></table-search>
    <table-list></table-list>
    <!--<add-or-edit></add-or-edit>-->
  </div>
</template>

<script>
import tableSearch from './Search'
import tableList from './List'

export default {
  name: 'setting',
  components: {
    tableSearch,
    tableList
  }
}
</script>

<style scoped>

</style>
