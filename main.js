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
				<product-shipping-detail-tabs :details="details" :premium="premium"></product-shipping-detail-tabs>
	
				<div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId" :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
				</div>
	
				<button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
				<button v-on:click="removeFromCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Remove from cart </button>
			</div>
			<product-tabs :reviews="reviews"></product-tabs>
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
			reviews: []
		}
	},
	methods: {
		addToCart() {
			this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
		},
		removeFromCart(){
			this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
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
		}
	},
	mounted() {
		eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
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
});

Vue.component('product-review', {
	template: `
		<form class="review-form" @submit.prevent="onSubmit">
			<p v-if="errors.length">
				<b>Please correct the following error(s).</b>
				<ul>
					<li v-for="error in errors">{{ error }}</li>
				</ul>
			</p>
			<p>
				<label for="name">Name:</label>
				<input id="name" v-model="name" placeholder="name">
			</p>

			<p>
				<label for="review">Review:</label>
				<textarea id="review" v-model="review"></textarea>
			</p>

			<p>
				<label for="rating">Rating:</label>
				<select id="rating" v-model="rating">
					<option>5</option>
					<option>4</option>
					<option>3</option>
					<option>2</option>
					<option>1</option>
				</select>
			</p>

			<p>
				<p>Would you recommend this product?</p>
				<div>
					<label for="yes">Yes</label>
					<input type="radio" id="yes" name="yes" value="yes" v-model="recommendation">
				</div>

				<div>
					<label for="no">No</label>
					<input type="radio" id="no" name="no" value="no" v-model="recommendation">
				</div>
			</p>

			<p>
				<input type="submit" value="Submit">
			</p>
		</form>
	`,
	data() {
		return {
			name: null,
			review: null,
			rating: null,
			recommendation: null,
			errors: []
		}
	},
	methods: {
		onSubmit() {
			if(this.name && this.review && this.rating && this.recommendation) {
				let productReview = {
					name: this.name,
					review: this.review,
					rating: Number(this.rating),
					recommendation: this.recommendation === "yes" ? true : false
				}
				eventBus.$emit('review-submitted', productReview)
				this.name = null
				this.review = null
				this.rating = null
				this.errors = []
			} else {
				if(!this.name) this.errors.push("Name required.")
				if(!this.review) this.errors.push("Review required.")
				if(!this.rating) this.errors.push("Rating required.")
				if(!this.recommendation) this.errors.push("Recommendation required.")
			}
		} 
	}
});

Vue.component('product-shipping-detail-tabs', {
	props: {
		premium: {
			type: Boolean,
			required: true
		},
		details: {
			type: Array,
			required: false
		}
	},
	template: `
		<div>
			<div>
				<span class="tab" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab" :class="{ activeTab: selectedTab === tab }">{{ tab }}</span>
			</div>
			<div v-show="selectedTab==='Shipping'">
				<p>Shipping: {{ shipping }}</p>
			</div>
			<div v-show="selectedTab==='Details'">
				<product-details :details="details"></product-details>
			</div>
		</div>
	`,
	data() {
		return {
			tabs: ['Shipping', 'Details'],
			selectedTab: 'Shipping'
		}
	},
	computed: {
		shipping() {
			return this.premium ? "Free" : 2.99;
		}
	}
})

Vue.component('product-tabs', {
	props: {
		reviews: {
			type: Array,
			required: false
		}
	},
	template: `
		<div>
			<div>
				<span class="tab" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab" :class="{ activeTab: selectedTab === tab }">{{ tab }}</span>
			</div>

			<div v-show="selectedTab==='Review'"> // displays when "Reviews" is clicked
				<p v-if="!reviews.length">There are no reviews yet.</p>
				<ul>
					<li v-for="review in reviews">
						<p>{{ review.name }}</p>
						<p>Rating: {{ review.rating }}</p>
						<p>{{ review.review }}</p>
						<p>Recommended: {{ review.recommendation }}</p>
					</li>
				</ul>
			</div>

			<div v-show="selectedTab === 'Make a Review'"> 
				<product-review></product-review>
			</div>
		</div>

	`,
	data() {
		return {
			tabs: ['Reviews', 'Make a Review'],
			selectedTab: 'Reviews'
		}
	}
})

var eventBus = new Vue()

var app = new Vue({
	el: '#app',
	data: {
		premium: true,
		cart: []
	},
	methods: {
		addItemOnCart(id) {
			this.cart.push(id)
		},
		removeItemFromCart(id) {
			for (let i=this.cart.length-1; i>=0; i--) {
				if (this.cart[i]===id) {
					this.cart.splice(i, 1);
				}
			}
		}
	}
});