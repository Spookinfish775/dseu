<template>
	<div id="document-editor">
		<vue-file-toolbar-menu :content="menu" class="bar" />
		<vue-document-editor
			class="editor"
			ref="editor"
			:content.sync="content"
			:zoom="zoom"
			:page_format_mm="page_format_mm"
			:page_margins="page_margins"
			:display="display"
		/>
	</div>
</template>

<script>
import VueFileToolbarMenu from "vue-file-toolbar-menu";
import VueDocumentEditor from "vue-document-editor";

export default {
	components: {
		VueDocumentEditor,
		VueFileToolbarMenu
	},
	props: {
		data: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			content: [this.data],
			zoom: 1,
			zoom_min: 0.1,
			zoom_max: 5.0,
			page_format_mm: [210, 297],
			page_margins: "10mm 15mm",
			page_font: "Times New Roman",
			display: "vertical",
			mounted: false
		};
	},

	computed: {
		menu() {
			return [
				{
					text: this.$t("documentEditor.print"),
					title: this.$t("documentEditor.print"),
					icon: "print",
					click: () => window.print()
				},
				{ is: "spacer" },
				{
					text: this.page_font,
					title: this.$t("documentEditor.fontFamily"),
					chevron: true,
					menu: this.fonts.map(font => {
						return {
							html: `<span style="font-family:${font}">${font}</span>`,
							active: this.page_font == font,
							click: () => {
								this.page_font = font;
								document.execCommand("fontName", false, font);
							}
						};
					}),
					menu_width: 200,
					menu_height: 280
				},
				{
					text: this.curFontSize,
					title: this.$t("documentEditor.fontSize"),
					chevron: true,
					menu: this.fontSizes.map(size => {
						return {
							text: size,
							active: this.curFontSize == size,
							click: () => {
								let selection = document.all
									? document.selection.createRange().text
									: document.getSelection();
								let selection_text = selection.toString();
								let span = document.createElement("SPAN");
								span.textContent = selection_text;
								let range = selection.getRangeAt(0);
								range.deleteContents();
								range.insertNode(span);
								span.style.fontSize = size;
							}
						};
					}),
					menu_width: 200,
					menu_height: 280
				},
				{ is: "separator" },
				{
					icon: "format_align_left",
					title: this.$t("documentEditor.alignLeft"),
					hotkey: this.isMacLike ? "shift+command+l" : "ctrl+shift+l",
					click: () => document.execCommand("justifyLeft")
				},
				{
					icon: "format_align_center",
					title: this.$t("documentEditor.alignCenter"),
					hotkey: this.isMacLike ? "shift+command+e" : "ctrl+shift+e",
					click: () => document.execCommand("justifyCenter")
				},
				{
					icon: "format_align_right",
					title: this.$t("documentEditor.alignRight"),
					hotkey: this.isMacLike ? "shift+command+r" : "ctrl+shift+r",
					click: () => document.execCommand("justifyRight")
				},
				{
					icon: "format_align_justify",
					title: this.$t("documentEditor.justifyContent"),
					hotkey: this.isMacLike ? "shift+command+j" : "ctrl+shift+j",
					click: () => document.execCommand("justifyFull")
				},
				{ is: "separator" },
				{
					icon: "format_bold",
					title: this.$t("documentEditor.bold"),
					active: this.isBold,
					disabled: !this.current_text_style,
					hotkey: this.isMacLike ? "command+b" : "ctrl+b",
					click: () => document.execCommand("bold")
				},
				{
					icon: "format_italic",
					title: this.$t("documentEditor.italic"),
					active: this.isItalic,
					disabled: !this.current_text_style,
					hotkey: this.isMacLike ? "command+i" : "ctrl+i",
					click: () => document.execCommand("italic")
				},
				{
					icon: "format_underline",
					title: this.$t("documentEditor.underline"),
					active: this.isUnderline,
					disabled: !this.current_text_style,
					hotkey: this.isMacLike ? "command+u" : "ctrl+u",
					click: () => document.execCommand("underline")
				},
				{
					icon: "format_strikethrough",
					title: this.$t("documentEditor.strikeThrough"),
					active: this.isStrikeThrough,
					disabled: !this.current_text_style,
					click: () => document.execCommand("strikethrough")
				},
				{
					is: "button-color",
					type: "compact",
					menu_class: "align-center",
					disabled: !this.current_text_style,
					color: this.curColor,
					update_color: new_color =>
						document.execCommand("foreColor", false, new_color.hex8)
				},
				{ is: "spacer" },
				{
					text: Math.floor(this.zoom * 100) + "%",
					title: this.$t("documentEditor.zoom"),
					icon: "zoom_in",
					chevron: true,
					menu: [
						["200%", 2.0],
						["150%", 1.5],
						["125%", 1.25],
						["100%", 1.0],
						["75%", 0.75],
						["50%", 0.5],
						["25%", 0.25]
					].map(([text, zoom]) => {
						return {
							text,
							active: this.zoom == zoom,
							click: () => {
								this.zoom = zoom;
							}
						};
					}),
					menu_width: 80,
					menu_height: 280,
					menu_class: "align-center"
				}
			];
		},
		fonts() {
			return [
				"Arial",
				"Verdana",
				"Helvetica ",
				"Tahoma",
				"Trebuchet MS",
				"Times New Roman",
				"Georgia",
				"Garamond",
				"Courier New",
				"Brush Script MT"
			];
		},
		fontSizes() {
			return [
				"8px",
				"9px",
				"10px",
				"11px",
				"12px",
				"14px",
				"18px",
				"24px",
				"30px",
				"36px",
				"48px",
				"60px",
				"72px",
				"96px"
			];
		},
		current_text_style() {
			return this.mounted ? this.$refs.editor.current_text_style : false;
		},
		isBold() {
			const fontWeight = this.current_text_style.fontWeight;
			return (
				fontWeight &&
				(parseInt(fontWeight) > 400 || fontWeight.indexOf("bold") == 0)
			);
		},
		isItalic() {
			return this.current_text_style.fontStyle == "italic";
		},
		isUnderline() {
			const stack = this.current_text_style.textDecorationStack;
			return stack && stack.some(d => d.indexOf("underline") == 0);
		},
		isStrikeThrough() {
			const stack = this.current_text_style.textDecorationStack;
			return stack && stack.some(d => d.indexOf("line-through") == 0);
		},
		curFontSize() {
			return this.current_text_style.fontSize || "14px";
		},
		curColor() {
			return this.current_text_style.color || "transparent";
		},
		isMacLike: () => /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
	},
	created() {
		let start_zoom_gesture = false;
		let start_dist_touch = false;
		let start_zoom_touch = false;
		window.addEventListener(
			"wheel",
			e => {
				if (e.ctrlKey) {
					e.preventDefault();
					this.zoom = Math.min(
						Math.max(this.zoom - e.deltaY * 0.01, this.zoom_min),
						this.zoom_max
					);
				}
			},
			{ passive: false }
		);
		window.addEventListener("gesturestart", e => {
			e.preventDefault();
			start_zoom_gesture = this.zoom;
		});
		window.addEventListener("gesturechange", e => {
			e.preventDefault();
			if (!start_zoom_touch) {
				this.zoom = Math.min(
					Math.max(start_zoom_gesture * e.scale, this.zoom_min),
					this.zoom_max
				);
			}
		});
		window.addEventListener("gestureend", () => {
			start_zoom_gesture = false;
		});
		window.addEventListener(
			"touchstart",
			e => {
				if (e.touches.length == 2) {
					e.preventDefault();
					start_dist_touch = Math.hypot(
						e.touches[0].pageX - e.touches[1].pageX,
						e.touches[0].pageY - e.touches[1].pageY
					);
					start_zoom_touch = this.zoom;
				}
			},
			{ passive: false }
		);
		window.addEventListener(
			"touchmove",
			e => {
				if (start_dist_touch && start_zoom_touch) {
					e.preventDefault();
					let zoom =
						(start_zoom_touch *
							Math.hypot(
								e.touches[0].pageX - e.touches[1].pageX,
								e.touches[0].pageY - e.touches[1].pageY
							)) /
						start_dist_touch;
					this.zoom = Math.min(Math.max(zoom, this.zoom_min), this.zoom_max);
				}
			},
			{ passive: false }
		);
		window.addEventListener(
			"touchend",
			() => {
				start_dist_touch = false;
				start_zoom_touch = false;
			},
			{ passive: false }
		);
	},
	mounted() {
		this.mounted = true;
	}
};
</script>

<style lang="scss">
#document-editor {
	.main {
		width: fit-content;
		min-width: 100%;
	}
	.bar {
		position: sticky;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 1000;
		background: rgba(248, 249, 250, 0.8);
		border-bottom: solid 1px rgb(248, 249, 250);
		backdrop-filter: blur(10px);
		--bar-button-active-color: #188038;
		--bar-button-open-color: #188038;
		--bar-button-active-bkg: #e6f4ea;
		--bar-button-open-bkg: #e6f4ea;
	}
}
</style>