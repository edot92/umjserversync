<template lang="pug">
  <v-container>
    <v-alert warning="warning" v-model="showWarning">tips: A Socket Server is needed.</v-alert>
    <v-list two-line="two-line">
      <template v-for="item in list.slice(0, 6)">
        <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
        <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
        <v-list-item v-else="v-else" v-bind:key="item.title">
          <v-list-tile avatar="avatar">
            <v-list-tile-avatar><img v-bind:src="item.avatar" /></v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="item.title">
                <v-list-tile-sub-title>
                  <timeago :since="item.time" :auto-update="10"></timeago>
                </v-list-tile-sub-title>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
      </template>
    </v-list>
    <v-layout>
      <v-flex xs12="xs12" xl6="xl6">
        <v-text-field v-model="message" label="Type your message and press Enter to send..." @keyup.enter.native="send"></v-text-field>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import ws from 'adonis-websocket-client'
  const io = ws(global.config.url, {})
  const client = io.channel('chat')

  export default {
    data () {
      return {
        list: [],
        message: '',
        showWarning: false,
        maxLength: 6
      }
    },
    methods: {
      send () {
        if (this.message.length < 1) {
          return false
        }
        client.emit('message', this.message)
        this.message = ''
      }
    },
    mounted () {
      client.connect((error, connected) => {
        if (error) {
          this.showWarning = true
          return false
          // do something
        }
        console.log('connected: ', connected)
        client.emit('message', 'hello')
        // all good
      })
      client.on('error', (message) => {
        console.log(message)
      })
      client.on('message', (message) => {
        this.list.push(message)
        if (this.list.length > this.maxLength) {
          this.list.shift()
        }
      })
    }
  }

</script>
