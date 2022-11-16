import Vue from "vue"

interface options {
  loadUrl: string,
  name: string
}

export class DocumentLoader {
  static async load(context: Vue, options: options) {
    try {
      let {
        data
      } = await context.$axios.get(options.loadUrl,
        { responseType: "arraybuffer" }
      );
      let blob = new Blob([data], {
        type: "application/octet-stream"
      });
      let fileURL = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.href = fileURL;
      link.download = options.name
      link.click();
    } catch (error) {
      throw new Error(error);
    }
  }
}
