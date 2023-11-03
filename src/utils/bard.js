// src/utils/Bard.js
class Bard {
  static JSON = "json";
  static MD = "markdown";
  #SNlM0e;
  #headers;
  #initPromise;
  #bardURL = "https://bard.google.com";
  #verbose = false;
  #fetch = fetch;

  constructor(cookie, config = {}) {
    if (!cookie) {
      console.error(
        "Initialization failed: Please provide a Cookie when initializing Bard."
      );
      return;
    }
    this.#initPromise = this.#init(cookie);
    this.#verbose = config.verbose === true;
    if (config.fetch) this.#fetch = config.fetch;
  }

  async #init(cookie) {
    this.#verbose && console.log("🚀 Starting initialization");

    this.#headers = {
      Host: "bard.google.com",
      "X-Same-Domain": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Origin: this.#bardURL,
      Referer: this.#bardURL,
      Cookie:
        typeof cookie === "object"
          ? Object.entries(cookie)
              .map(([key, val]) => `${key}=${val};`)
              .join("")
          : "__Secure-1PSID=" + cookie,
    };

    try {
      this.#verbose && console.log("🔒 Authenticating your Google account");
      const response = await this.#fetch(this.#bardURL, {
        method: "GET",
        headers: this.#headers,
        credentials: "include",
      });
      const responseText = await response.text();
      const SNlM0e = responseText.match(/SNlM0e":"(.*?)"/)[1];
      this.#SNlM0e = SNlM0e;
      this.#verbose && console.log("✅ Initialization finished\n");
      return SNlM0e;
    } catch (e) {
      console.error(
        "Initialization failed. Please check your internet connection and ensure that the Cookie is correct:",
        e
      );
      return null;
    }
  }

  async #uploadImage(name, buffer) {
    this.#verbose && console.log("🖼️ Starting image processing");
    const size = buffer.byteLength;
    const formBody = [
      `${encodeURIComponent("File name")}=${encodeURIComponent([name])}`,
    ];

    try {
      this.#verbose && console.log("💻 Finding Google server destination");
      let response = await this.#fetch(
        "https://content-push.googleapis.com/upload/",
        {
          method: "POST",
          headers: {
            "X-Goog-Upload-Command": "start",
            "X-Goog-Upload-Protocol": "resumable",
            "X-Goog-Upload-Header-Content-Length": size,
            "X-Tenant-Id": "bard-storage",
            "Push-Id": "feeds/mcudyrk2a4khkz",
          },
          body: formBody,
          credentials: "include",
        }
      );

      const uploadUrl = response.headers.get("X-Goog-Upload-URL");
      this.#verbose && console.log("📤 Sending your image");
      response = await this.#fetch(uploadUrl, {
        method: "POST",
        headers: {
          "X-Goog-Upload-Command": "upload, finalize",
          "X-Goog-Upload-Offset": 0,
          "X-Tenant-Id": "bard-storage",
        },
        body: buffer,
        credentials: "include",
      });

      const imageFileLocation = await response.text();
      this.#verbose && console.log("✅ Image finished working\n");
      return imageFileLocation;
    } catch (e) {
      console.error(
        "Image processing failed: Could not fetch Google Bard. Ensure your internet connection:",
        e
      );
      return null;
    }
  }

  async #query(message, config) {
    const formatMarkdown = (text, images) => {
      if (!images) return text;
      for (let imageData of images) {
        const formattedTag = `!${imageData.tag}(${imageData.url})`;
        text = text.replace(
          new RegExp(`(?!\\!)\\[${imageData.tag.slice(1, -1)}\\]`),
          formattedTag
        );
      }
      return text;
    };

    const { ids, imageBuffer } = config;
    await this.#initPromise;
    this.#verbose && console.log("🔎 Starting Bard Query");

    if (!this.#SNlM0e) {
      console.error("Error: Bard not initialized");
      return {
        content: `**Error: Bard not initialized**\n\nYou need to obtain the cookie session value. Here's how you can get it:\n\n1. Visit https://bard.google.com \n2. Open the browser console by pressing \`F12\`.\n3. Go to the \`Application\` tab.\n4. Under \`Cookies\`, find the cookie named \`__Secure-1PSID\` or \`__Secure-3PSID\`.\n5. Copy the value of the cookie, which will be your session value. Use as \`cookie\` in \`/updatecookie\`.`,
        images: [],
        ids: {},
      };
    }

    this.#verbose && console.log("🏗️ Building Request");
    const params = {
      bl: "boq_assistant-bard-web-server_20230711.08_p0",
      _reqID: ids?._reqID ?? "0",
      rt: "c",
    };

    const messageStruct = [[message], null, [null, null, null]];

    if (imageBuffer) {
      const imageLocation = await this.#uploadImage(
        `bard-ai_upload`,
        imageBuffer
      );
      messageStruct[0].push(0, null, [[[imageLocation, 1], "bard-ai_upload"]]);
    }

    if (ids) {
      const { conversationID, responseID, choiceID } = ids;
      messageStruct[2] = [conversationID, responseID, choiceID];
    }

    const data = {
      "f.req": JSON.stringify([null, JSON.stringify(messageStruct)]),
      at: this.#SNlM0e,
    };

    const url = new URL(
      "/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate",
      this.#bardURL
    );

    for (const key in params) {
      url.searchParams.append(key, params[key]);
    }

    const formBody = Object.entries(data)
      .map(
        ([property, value]) =>
          `${encodeURIComponent(property)}=${encodeURIComponent(value)}`
      )
      .join("&");

    this.#verbose && console.log("💭 Sending message to Bard");
    const response = await this.#fetch(url.toString(), {
      method: "POST",
      headers: this.#headers,
      body: formBody,
      credentials: "include",
    });

    const text = await response.text();
    const chatData = JSON.parse(text.split("\n")[3])[0][2];
    const parsedData = JSON.parse(chatData);

    this.#verbose && console.log("🧩 Parsing output");
    const answer = parsedData[4][0];
    const textContent = answer[1][0];

    const images =
      answer[4]?.map((x) => ({
        tag: x[2],
        url: x[3][0][0],
        info: {
          raw: x[0][0][0],
          source: x[1][0][0],
          alt: x[0][4],
          website: x[1][1],
          favicon: x[1][3],
        },
      })) ?? [];

    this.#verbose && console.log("✅ All done!\n");

    return {
      content: formatMarkdown(textContent, images),
      images: images,
      ids: {
        conversationID: parsedData[1][0],
        responseID: parsedData[1][1],
        choiceID: answer[0],
        _reqID: String(parseInt(ids?._reqID ?? 0) + 100000),
      },
    };
  }

  async #parseConfig(config) {
    const result = {
      useJSON: false,
      imageBuffer: undefined,
      ids: undefined,
    };

    if (config?.format) {
      switch (config.format) {
        case Bard.JSON:
          result.useJSON = true;
          break;
        case Bard.MD:
          result.useJSON = false;
          break;
        default:
          console.error(
            "Invalid format. Format can only be Bard.JSON for JSON output or Bard.MD for Markdown output."
          );
          return result;
      }
    }

    if (config?.image) {
      if (config.image instanceof ArrayBuffer) {
        result.imageBuffer = config.image;
      } else if (
        typeof config.image === "string" &&
        /\.(jpeg|jpg|png|webp)$/.test(config.image)
      ) {
        console.error(
          "Image processing failed: Loading from an image file path is not supported in a browser environment."
        );
        return result;
      } else {
        console.error(
          "Image processing failed: Provide your image as a Buffer."
        );
        return result;
      }
    }

    if (config?.ids) {
      if (
        config.ids.conversationID &&
        config.ids.responseID &&
        config.ids.choiceID &&
        config.ids._reqID
      ) {
        result.ids = config.ids;
      } else {
        console.error(
          "Invalid IDs provided. Please provide the IDs exported exactly as given."
        );
        return result;
      }
    }

    return result;
  }

  async ask(message, config) {
    const { useJSON, imageBuffer, ids } = await this.#parseConfig(config);
    const response = await this.#query(message, { imageBuffer, ids });
    return useJSON ? response : response.content;
  }

  createChat(ids) {
    const bard = this;
    class Chat {
      ids = ids;

      async ask(message, config) {
        const { useJSON, imageBuffer } = await bard.#parseConfig(config);
        const response = await bard.#query(message, {
          imageBuffer,
          ids: this.ids,
        });
        this.ids = response.ids;
        return useJSON ? response : response.content;
      }

      export() {
        return this.ids;
      }
    }
    return new Chat();
  }
}

module.exports = Bard;
