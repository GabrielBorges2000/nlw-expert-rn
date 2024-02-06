import { CategoryButton } from '@/components/category-button'
import { Header } from '@/components/header'
import { View, FlatList, SectionList, Text } from 'react-native'
import { CATEGORIES, MENU } from '@/utils/data/products'
import { useState, useRef } from 'react'
import { Product } from '@/components/product'
import { Link } from 'expo-router'
import { useCartStore } from '@/stores/cart-store'

export default function Home() {
  const cartStore = useCartStore()
  const [category, setCategory] = useState(CATEGORIES[0])

  const sectionListReft = useRef<SectionList>(null)

  const cartQuantityItems = cartStore.products.reduce((total, product) => total + product.quantity, 0)

  function handleCategorySelect(selectCategory: string) {
    setCategory(selectCategory)

    const sectionIndex = CATEGORIES.findIndex((category) => category === selectCategory)

    if (sectionListReft.current) {
      sectionListReft.current.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0
      })
    }
  }

  return (
    <View className='flex-1 pt-8'>
      <Header title='Faça seu pedido' cartQuantityItems={cartQuantityItems} />
      {/* category */}
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === category}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        className='max-h-10 mt-5 '
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      />
      {/* Product */}
      <SectionList
        ref={sectionListReft}
        sections={MENU}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} asChild>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            className='text-xl text-white font-heading mt-8 mb-3'
          >{title}</Text>
        )}
        className='flex-1 p-5'
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  )
}