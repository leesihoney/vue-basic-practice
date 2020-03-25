Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `
		<div class="product">
			<div class="product-image">
				<img :src="image" />
			</div>
	
			<div class="product-info">
				<h1> {{ title }} </h1>
				<p>User is premium: {{ premium }} </p>
				<p v-if="inStock">In Stock</p>
				<p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
				<p>Shipping: {{ shipping }}</p>
				<product-details :details="details"></product-details>
	
				<div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId" :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
				</div>
	
				<button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
				
				<div class="cart">
					<p>Cart({{ cart }})</p>
				</div>
			</div>
		</div>
	`,
	data() {
		return {
			product: "Socks",
			brand: "Vue Mastery",
			onSale: true,
			selectedVariant: 0,
			details: ["80% cotton", "20% polyester", "Gender-neutral"],
			variants: [
				{
					variantId: 2234,
					variantColor: "green",
					variantImage: "./assets/vmSocks-green.jpg",
					variantQuantity: 10
				},
				{
					variantId: 2235,
					variantColor: "blue",
					variantImage: "./assets/vmSocks-blue.jpg",
					variantQuantity: 0
				}
			],
			cart: 0
		}
	},
	methods: {
		addToCart() {
			this.cart += 1
		},
		updateProduct(index) {
			this.selectedVariant = index;
		}
	},
	computed: {
		title() {
			return this.brand + " " + this.product;
		},
		image() {
			return this.variants[this.selectedVariant].variantImage;
		},
		inStock() {
			return this.variants[this.selectedVariant].variantQuantity;
		},
		shipping() {
			return this.premium ? "Free" : 2.99;
		}
	}
});

Vue.component('product-details', {
	props: {
		details: {
			type: Array,
			required: true
		}
	},
	template: `
		<ul>
			<li v-for="detail in details">{{ detail }}</li>
		</ul>
	`
})

var app = new Vue({
	el: '#app',
	data: {
		premium: true
	}
});