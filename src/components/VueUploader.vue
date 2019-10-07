<template>
  <div class="vue-uploader">
    <div class="dropzone" @click="addFiles" @dragover.prevent @drop.prevent="handleDrop">
      <input type="file" ref="input" :multiple="multiple" @change="handleUploads">

      <p v-if="!hasFiles">Drag your file(s) here to begin<br> or click to browse</p>

      <div class="dropzone__preview" v-else>
        <div v-for="(file, key) in previews" :key="key" class="file" @click.stop>
          <img :src="file.url" :alt="file.name" v-if="file.type === 'image' && file.url">
          <div class="file__icon" v-else>
            <img :src="`@/assets/icons/${file.type}.svg`" :alt="file.name">
          </div>
          <div class="file__details">
            <span class="file__name">{{ file.name }}</span>
            <span class="file__size">{{ file.size }}</span>
            <span class="file__remove" @click="removeFile(key)">Remove</span>
          </div>
        </div>
      </div>
    </div>
    <div class="actionbar">
      <button @click="submit">Upload</button>
      <button @click="clear">Clear</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'VueUploader',

  props: {
    multiple: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      files: [],
      previews: [],
      url: ''
    }
  },

  computed: {
    /**
     * Check for uploaded files
     * ---
     *
     * @return {Boolean} - Has files
     */
    hasFiles () {
      return this.files.length > 0
    }
  },

  methods: {
    /**
     * Format bytes
     * ---
     *
     * Format bytes to: Bytes, KB, MB, GB, TB, PB, EB, ZB and YB.
     *
     * @example
     * // returns 1 KB
     * formatBytes(1024);
     *
     * @example
     * // returns 1 MB
     * formatBytes(1048576);
     *
     * @param {Number, String} bytes - Bytes
     * @param {Number} decimals - Fixed decimals
     *
     * @return { String } - Returns the formatted bytes.
     */
    formatBytes (bytes, decimals = 0) {
      if (bytes === 0) return '0 Bytes'

      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
    },

    /**
     * Handles a change on the file upload
     */
    handleUploads () {
      this.handleFiles(this.$refs.input.files)
    },

    /**
     * Handles drop event on the dropzone
     */
    handleDrop (event) {
      this.handleFiles(event.dataTransfer.files)
    },

    /**
     * Handles files
     */
    handleFiles (files) {
      //  Adds the uploaded file to the files array
      for (var i = 0; i < files.length; i++) {
        this.files.push(files[i])
        this.readFile(files[i])
      }
    },

    /**
     * Read a file
     * ---
     *
     * @param  {File} file - The file to read.
     */
    readFile (file) {
      const reader = new FileReader()

      // Check if file is an image
      if (file && file['type'].split('/')[0] === 'image') {
        // Read the image and push it to previews array
        reader.onload = e => {
          this.previews.push({
            name: file.name,
            size: this.formatBytes(file.size),
            url: e.target.result,
            type: 'image'
          })
        }

        reader.readAsDataURL(file)
      } else {
        this.previews.push({
          name: file.name,
          size: this.formatBytes(file.size),
          type: 'document'
        })
      }
    },

    /**
     * Adds a file
     */
    addFiles () {
      this.$refs.input.click()
    },

    /**
     * Removes a select file the user has uploaded
     */
    removeFile (key) {
      this.files.splice(key, 1)
      this.previews.splice(key, 1)
    },

    /**
     * Submits all of the files to the server
     */
    submit () {
      // Initialize the form data
      let formData = new FormData()

      //  Iterate over any file sent over appending the files
      //  to the form data.
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i]

        formData.append('files[' + i + ']', file)
      }

      //  Make the POST request
      axios.post(this.url,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(() => {
        console.log('SUCCESS!!')
      })
        .catch(() => {
          console.log('FAILURE!!')
        })
    },

    clear() {
      this.files = []
      this.previews = []
    }
  }
}
</script>

<style lang="scss" scoped>
  $primary: #F9FAFD;
  $secondary: #667283;
  $background: $primary;
  $border-color: $secondary;
  $border-radius: 30px;

  @mixin dashed-border($border-weight: 4px, $dash-size: 15px, $gap-size: 15px) {
    $gap-calc-1: $gap-size / 2;
    $gap-calc-2: $gap-size / 2 + $dash-size;
    $dash-calc: $dash-size + $gap-size;

    background: linear-gradient(90deg, $border-color 100%, transparent 100%) top left no-repeat,
    linear-gradient(90deg, transparent $gap-calc-1, $border-color $gap-calc-1, $border-color $gap-calc-2, transparent $gap-calc-2) top center repeat-x,
    linear-gradient(90deg, $border-color 100%, transparent 100%) top right no-repeat,
    linear-gradient(0deg, $border-color 100%, transparent 100%) top left no-repeat,
    linear-gradient(0deg, transparent $gap-calc-1, $border-color $gap-calc-1, $border-color $gap-calc-2, transparent $gap-calc-2) center left repeat-y,
    linear-gradient(0deg, $border-color 100%, transparent 100%) bottom left no-repeat,
    linear-gradient(90deg, $border-color 100%, transparent 100%) bottom left no-repeat,
    linear-gradient(90deg, transparent $gap-calc-1, $border-color $gap-calc-1, $border-color $gap-calc-2, transparent $gap-calc-2) bottom center repeat-x,
    linear-gradient(90deg, $border-color 100%, transparent 100%) bottom right no-repeat,
    linear-gradient(0deg, $border-color 100%, transparent 100%) top right no-repeat,
    linear-gradient(0deg, transparent $gap-calc-1, $border-color $gap-calc-1, $border-color $gap-calc-2, transparent $gap-calc-2) center right repeat-y,
    linear-gradient(0deg, $border-color 100%, transparent 100%) bottom right no-repeat;
    background-size: $dash-size $border-weight, $dash-calc $border-weight, $dash-size $border-weight, $border-weight $dash-size, $border-weight $dash-calc, $border-weight $dash-size;
  }


  .vue-uploader {
    $padding: 30px;
    position: relative;
    background: $background;
    border-radius: $border-radius;
    padding: $padding;
    cursor: pointer;

    .dropzone {
      $dropzone: '.dropzone';
      position: relative;
      /*border: 1px dashed $border-color;
      border-radius: $border-radius;*/

      input[type="file"] {
        display: none;
      }

      p {
        font-size: 1.2em;
        text-align: center;
        padding: 50px 0;
        color: $secondary;
      }

      #{$dropzone}__preview {
        display: flex;
        flex-wrap: wrap;
        margin: -15px;

        .file {
          $file: '.file';
          position: relative;
          display: flex;
          justify-content: center;
          width: 150px;
          height: 150px;
          margin: 15px;
          border-radius: 15px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          #{$file}__icon {
            width: 50px;
            height: 50px;
          }

          #{$file}__details {
            position: absolute;
            top: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            opacity: 0;
            transition: opacity 150ms ease-in-out;

            span {
              color: #fff;
            }

            #{$file}__remove {
              color: red;
              cursor: pointer;
              float: right;
            }
          }

          &:hover {
            #{$file}__details {
              opacity: 1;
            }
          }
        }
      }

      /*&:after {
        transition: all .6s ease;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: $border-radius;
        @include dashed-border()
      }

      &:hover {
        &:after {
          @include dashed-border(4px, 30px, 30px)
        }
      }*/
    }

    .actionbar {
      margin-top: 30px;

      button {
        color: $secondary;
        background-color: transparent;
        border: 1px solid $border-color;
        border-radius: $border-radius;
        outline: none !important;
        padding: 10px 30px;
        cursor: pointer;
        margin-left: 15px;
        transition: background-color 150ms ease-in-out, color 150ms ease-in-out;

        &:first-of-type {
          margin-left: 0;
        }

        &:hover {
          background-color: $secondary;
          color: #fff;
        }
      }
    }
  }
</style>
