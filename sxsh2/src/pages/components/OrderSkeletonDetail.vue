<template>
    <a-col :span="18" class="">
        <a-card size="small">
            <a-descriptions bordered size="small" :column="2">
                <a-descriptions-item label="订单号">
                    <a-skeleton-input active class="w-250px" />
                </a-descriptions-item>
                <a-descriptions-item label="结算时间">
                    <a-skeleton-input active class="w-250px" />
                </a-descriptions-item>
                <a-descriptions-item label="总价">
                    <a-skeleton-input active class="w-250px" />
                </a-descriptions-item>
                <a-descriptions-item label="应付">
                    <a-skeleton-input active class="w-250px" />
                </a-descriptions-item>
                <a-descriptions-item label="实收">
                    <a-skeleton-input active class="w-250px" />
                </a-descriptions-item>
                <a-descriptions-item label="优惠">
                    <a-skeleton-input active class="w-250px" />
                </a-descriptions-item>
                <a-descriptions-item label="找零">
                    <a-skeleton-input active class="w-250px" />
                </a-descriptions-item>
                <a-descriptions-item label="付款方式">
                    <a-skeleton-input active class="w-250px" />
                </a-descriptions-item>

                <a-descriptions-item label="其他信息">
                    <a-skeleton-input active class="w-full" />
                    <br />
                    <a-skeleton-input active class="w-250px mt-2" />
                </a-descriptions-item>
            </a-descriptions>
        </a-card>
        <a-card class="mt-2 h-41vh" size="small">
            <a-skeleton :paragraph="{ rows: 7 }" active class="w-full" />
        </a-card>
        <a-card size="small" class="mt-2 text-right">
            <a-skeleton-button class="mx-2" />
            <a-skeleton-button class="mx-2" />
        </a-card>
    </a-col>
</template>
