<template>
    <a-list
        item-layout="horizontal"
        :data-source="Array(4).fill(0)"
        class=" h-75vh overflow-y-scroll mt-2 w-full "
        size="small"
    >
        <template #renderItem="{ item, index }">
            <a-list-item key="item.title" class="pl-3 flex flex-col">
                <a-list-item-meta :description="`暂无数据`" class="w-full">
                    <template #title>
                        <a-skeleton-input active class="w-full" size="small" />
                    </template>
                    <template #avatar><a-skeleton-avatar active /></template>
                </a-list-item-meta>
                <div class="w-full text-pink-500 truncate">
                    <a-skeleton-input active class="w-full" />
                </div>
            </a-list-item>
        </template>
    </a-list>
</template>
