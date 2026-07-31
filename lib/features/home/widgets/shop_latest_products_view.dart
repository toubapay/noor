import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:collection/collection.dart';
import 'package:sixam_mart/api/api_client.dart';
import 'package:sixam_mart/common/widgets/custom_image.dart';
import 'package:sixam_mart/common/widgets/discount_tag.dart';
import 'package:sixam_mart/common/widgets/title_widget.dart';
import 'package:sixam_mart/features/item/controllers/item_controller.dart';
import 'package:sixam_mart/features/item/domain/models/item_model.dart';
import 'package:sixam_mart/features/splash/controllers/splash_controller.dart';
import 'package:sixam_mart/helper/price_converter.dart';
import 'package:sixam_mart/util/app_constants.dart';
import 'package:sixam_mart/util/dimensions.dart';
import 'package:sixam_mart/util/styles.dart';
import 'package:shimmer_animation/shimmer_animation.dart';

/// "Latest products" teaser shown on the module-picker screen (before the
/// user has chosen a module), sourced from the Shop/ecommerce module's
/// catalogue specifically, per product decision.
///
/// There is no module-agnostic "latest items" endpoint in this API - every
/// item list is scoped by the `moduleId` header. Rather than switching the
/// user's actual selected module (which would break the "no module chosen
/// yet" state this screen represents), this fetches AppConstants.popularItemUri
/// directly with a one-off header override, bypassing ItemController/
/// ItemRepository's global-module-state assumption entirely so no shared
/// state is touched. `popularItemUri` (not the store-scoped `storeItemUri`)
/// is the only endpoint that returns a module-wide item feed without a
/// specific store_id, so it's used here as the "latest products" source.
class ShopLatestProductsView extends StatefulWidget {
  const ShopLatestProductsView({super.key});

  @override
  State<ShopLatestProductsView> createState() => _ShopLatestProductsViewState();
}

class _ShopLatestProductsViewState extends State<ShopLatestProductsView> {
  List<Item>? _items;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final splashController = Get.find<SplashController>();
    final shopModule = (splashController.moduleList ?? []).firstWhereOrNull(
      (module) => module.moduleType == AppConstants.ecommerce,
    );

    if (shopModule == null) {
      setState(() => _loading = false);
      return;
    }

    final apiClient = Get.find<ApiClient>();
    final headers = Map<String, String>.from(apiClient.getHeader());
    headers[AppConstants.moduleId] = '${shopModule.id}';

    final uri = Uri.parse(AppConstants.popularItemUri).replace(queryParameters: {
      'type': 'all',
      'offset': '1',
      'limit': '10',
    }).toString();

    final response = await apiClient.getData(uri, headers: headers);

    if (!mounted) return;
    setState(() {
      _loading = false;
      if (response.statusCode == 200) {
        _items = ItemModel.fromJson(response.body).items;
      }
    });
  }

  /// Selects the item's own module (Shop) before navigating, matching the
  /// same "isFeatured" pattern ItemWidget already uses for cross-module
  /// taps elsewhere in the app.
  void _openItem(Item item) {
    final splashController = Get.find<SplashController>();
    final module = (splashController.moduleList ?? []).firstWhereOrNull((m) => m.id == item.moduleId);
    if (module != null) {
      splashController.setModule(module);
    }
    Get.find<ItemController>().navigateToItemPage(item, context);
  }

  @override
  Widget build(BuildContext context) {
    if (!_loading && (_items == null || _items!.isEmpty)) {
      return const SizedBox();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeDefault),
          // No "see all" destination: every existing item-listing screen in
          // this app assumes a module is already selected, which isn't true
          // on this screen. Adding onTap here would need a new screen (or a
          // safe module-switch-then-navigate flow) - out of scope for now.
          child: TitleWidget(title: 'latest_products'.tr),
        ),
        const SizedBox(height: Dimensions.paddingSizeSmall),

        SizedBox(
          height: 195,
          child: _loading
              ? _LatestProductsShimmer()
              : ListView.builder(
                  physics: const BouncingScrollPhysics(),
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeDefault),
                  itemCount: _items!.length,
                  itemBuilder: (context, index) {
                    final item = _items![index];
                    return Padding(
                      padding: const EdgeInsets.only(right: Dimensions.paddingSizeSmall),
                      child: _ProductCard(item: item, onTap: () => _openItem(item)),
                    );
                  },
                ),
        ),
        const SizedBox(height: Dimensions.paddingSizeSmall),
      ],
    );
  }
}

class _ProductCard extends StatelessWidget {
  final Item item;
  final VoidCallback onTap;
  const _ProductCard({required this.item, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(Dimensions.radiusDefault),
      onTap: onTap,
      child: Container(
        width: 140,
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(Dimensions.radiusDefault),
          border: Border.all(color: Theme.of(context).disabledColor.withValues(alpha: 0.15)),
          boxShadow: [BoxShadow(color: Theme.of(context).shadowColor, blurRadius: 8, offset: const Offset(0, 2))],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Stack(children: [
            CustomImage(image: item.imageFullUrl ?? '', height: 100, width: double.infinity, fit: BoxFit.cover),
            DiscountTag(discount: item.discount, discountType: item.discountType, freeDelivery: false),
          ]),
          Padding(
            padding: const EdgeInsets.all(Dimensions.paddingSizeExtraSmall),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(
                item.name ?? '',
                style: robotoMedium.copyWith(fontSize: Dimensions.fontSizeSmall),
                maxLines: 1, overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 3),
              Text(
                PriceConverter.convertPrice(item.price, discount: item.discount, discountType: item.discountType),
                style: robotoBold.copyWith(fontSize: Dimensions.fontSizeSmall, color: Theme.of(context).primaryColor),
                maxLines: 1, overflow: TextOverflow.ellipsis,
              ),
            ]),
          ),
        ]),
      ),
    );
  }
}

class _LatestProductsShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeDefault),
      itemCount: 4,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.only(right: Dimensions.paddingSizeSmall),
          child: Shimmer(
            duration: const Duration(seconds: 2),
            child: Container(
              width: 140,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(Dimensions.radiusDefault),
              ),
            ),
          ),
        );
      },
    );
  }
}
