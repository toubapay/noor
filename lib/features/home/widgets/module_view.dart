import 'package:shimmer_animation/shimmer_animation.dart';
import 'package:sixam_mart/common/widgets/address_widget.dart';
import 'package:sixam_mart/common/widgets/custom_ink_well.dart';
import 'package:sixam_mart/features/banner/controllers/banner_controller.dart';
import 'package:sixam_mart/features/brands/controllers/brands_controller.dart';
import 'package:sixam_mart/features/location/controllers/location_controller.dart';
import 'package:sixam_mart/features/profile/controllers/profile_controller.dart';
import 'package:sixam_mart/features/splash/controllers/splash_controller.dart';
import 'package:sixam_mart/features/address/controllers/address_controller.dart';
import 'package:sixam_mart/features/address/domain/models/address_model.dart';
import 'package:sixam_mart/helper/address_helper.dart';
import 'package:sixam_mart/helper/auth_helper.dart';
import 'package:sixam_mart/helper/responsive_helper.dart';
import 'package:sixam_mart/helper/route_helper.dart';
import 'package:sixam_mart/util/dimensions.dart';
import 'package:sixam_mart/util/styles.dart';
import 'package:sixam_mart/common/widgets/custom_image.dart';
import 'package:sixam_mart/common/widgets/custom_loader.dart';
import 'package:sixam_mart/common/widgets/title_widget.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sixam_mart/features/home/widgets/banner_view.dart';
import 'package:sixam_mart/features/home/widgets/popular_store_view.dart';
import 'package:sixam_mart/features/home/widgets/shop_latest_products_view.dart';

class ModuleView extends StatelessWidget {
  final SplashController splashController;
  const ModuleView({super.key, required this.splashController});

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

      /// Brand-color hero zone holding the module picker bubbles, curving
      /// into the regular white content below.
      Container(
        width: double.infinity,
        color: Theme.of(context).primaryColor,
        padding: const EdgeInsets.only(top: Dimensions.paddingSizeLarge, bottom: Dimensions.paddingSizeExtraLarge),
        child: splashController.moduleList != null ? splashController.moduleList!.isNotEmpty ? Wrap(
          alignment: WrapAlignment.center,
          runSpacing: Dimensions.paddingSizeLarge,
          children: List.generate(splashController.moduleList!.length, (index) {
            return SizedBox(
              width: MediaQuery.of(context).size.width / 3,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeExtraSmall),
                child: CustomInkWell(
                  onTap: () => splashController.switchModule(index, true),
                  radius: Dimensions.radiusPill,
                  child: Column(mainAxisSize: MainAxisSize.min, children: [
                    Stack(clipBehavior: Clip.none, alignment: Alignment.center, children: [

                      Container(
                        height: 84, width: 84,
                        decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: 0.35)),
                        child: Center(child: Container(
                          height: 66, width: 66,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle, color: Colors.white,
                            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 6, offset: const Offset(0, 3))],
                          ),
                          padding: const EdgeInsets.all(12),
                          child: ClipOval(child: CustomImage(
                            image: '${splashController.moduleList![index].iconFullUrl}',
                            height: 42, width: 42, fit: BoxFit.contain,
                          )),
                        )),
                      ),

                      Positioned(
                        bottom: -14,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeSmall, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.white, borderRadius: BorderRadius.circular(Dimensions.radiusPill),
                            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 4, offset: const Offset(0, 2))],
                          ),
                          child: Text(
                            splashController.moduleList![index].moduleName!,
                            textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis,
                            style: robotoBold.copyWith(fontSize: Dimensions.fontSizeOverSmall, color: Theme.of(context).primaryColor),
                          ),
                        ),
                      ),

                    ]),
                    const SizedBox(height: Dimensions.paddingSizeDefault),
                  ]),
                ),
              ),
            );
          }),
        ) : Center(child: Padding(
          padding: const EdgeInsets.only(top: Dimensions.paddingSizeSmall),
          child: Text('no_module_found'.tr, style: robotoMedium.copyWith(color: Colors.white)),
        )) : ModuleShimmer(isEnabled: splashController.moduleList == null),
      ),

      /// White content sheet: rounded top corners overlap the hero zone for
      /// the soft curve transition.
      Transform.translate(
        offset: const Offset(0, -Dimensions.paddingSizeExtraLarge),
        child: Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: const BorderRadius.only(topLeft: Radius.circular(Dimensions.radiusExtraLarge), topRight: Radius.circular(Dimensions.radiusExtraLarge)),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const SizedBox(height: Dimensions.paddingSizeSmall),

            GetBuilder<BannerController>(builder: (bannerController) {
              return const BannerView(isFeatured: true);
            }),

            GetBuilder<BrandsController>(builder: (brandsController) {
              return (brandsController.brandList != null && brandsController.brandList!.isNotEmpty) ? Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeDefault),
                    child: Text(
                      (AuthHelper.isLoggedIn() && Get.find<ProfileController>().userInfoModel?.fName != null)
                          ? '${Get.find<ProfileController>().userInfoModel!.fName}, ${'save_on_top_brands'.tr}'
                          : 'save_on_top_brands'.tr,
                      style: robotoMedium.copyWith(fontSize: Dimensions.fontSizeLarge, color: Theme.of(context).disabledColor),
                    ),
                  ),
                  const SizedBox(height: Dimensions.paddingSizeSmall),

                  SizedBox(
                    height: 90,
                    child: ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeDefault),
                      itemCount: brandsController.brandList!.length > 8 ? 8 : brandsController.brandList!.length,
                      itemBuilder: (context, index) {
                        return Padding(
                          padding: const EdgeInsets.only(right: Dimensions.paddingSizeSmall),
                          child: InkWell(
                            borderRadius: BorderRadius.circular(Dimensions.radiusDefault),
                            onTap: () => Get.toNamed(RouteHelper.getBrandsItemScreen(brandsController.brandList![index].id!, brandsController.brandList![index].name!)),
                            child: Container(
                              height: 80, width: 80,
                              padding: const EdgeInsets.all(Dimensions.paddingSizeExtraSmall),
                              decoration: BoxDecoration(
                                color: Theme.of(context).disabledColor.withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(Dimensions.radiusDefault),
                                border: Border.all(color: Theme.of(context).disabledColor.withValues(alpha: 0.1)),
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(Dimensions.radiusDefault),
                                child: CustomImage(image: '${brandsController.brandList![index].imageFullUrl}', height: 70, width: 70, fit: BoxFit.contain),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: Dimensions.paddingSizeSmall),

                ],
              ) : const SizedBox();
            }),

            const ShopLatestProductsView(),

            GetBuilder<AddressController>(builder: (locationController) {
              List<AddressModel?> addressList = [];
              if(AuthHelper.isLoggedIn() && locationController.addressList != null) {
                addressList = [];
                bool contain = false;
                if(AddressHelper.getUserAddressFromSharedPref()!.id != null) {
                  for(int index=0; index<locationController.addressList!.length; index++) {
                    if(locationController.addressList![index].id == AddressHelper.getUserAddressFromSharedPref()!.id) {
                      contain = true;
                      break;
                    }
                  }
                }
                if(!contain) {
                  addressList.add(AddressHelper.getUserAddressFromSharedPref());
                }
                addressList.addAll(locationController.addressList!);
              }
              return (!AuthHelper.isLoggedIn() || locationController.addressList != null) ? addressList.isNotEmpty ? Column(
                children: [

                  const SizedBox(height: Dimensions.paddingSizeLarge),

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeSmall),
                    child: TitleWidget(title: 'deliver_to'.tr),
                  ),
                  const SizedBox(height: Dimensions.paddingSizeExtraSmall),

                  SizedBox(
                    height: 80,
                    child: ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      itemCount: addressList.length,
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.only(left: Dimensions.paddingSizeSmall, right: Dimensions.paddingSizeSmall, top: Dimensions.paddingSizeExtraSmall),
                      itemBuilder: (context, index) {
                        return Container(
                          width: 300,
                          padding: const EdgeInsets.only(right: Dimensions.paddingSizeSmall),
                          child: AddressWidget(
                            address: addressList[index],
                            fromAddress: false,
                            onTap: () {
                              if(AddressHelper.getUserAddressFromSharedPref()!.id != addressList[index]!.id) {
                                Get.dialog(const CustomLoaderWidget(), barrierDismissible: false);
                                Get.find<LocationController>().saveAddressAndNavigate(
                                  addressList[index], false, null, false, ResponsiveHelper.isDesktop(context),
                                );
                              }
                            },
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ) : const SizedBox() : AddressShimmer(isEnabled: AuthHelper.isLoggedIn() && locationController.addressList == null);
            }),

            const PopularStoreView(isPopular: false, isFeatured: true),

            const SizedBox(height: 120),

          ]),
        ),
      ),

    ]);
  }
}

class ModuleShimmer extends StatelessWidget {
  final bool isEnabled;
  const ModuleShimmer({super.key, required this.isEnabled});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      alignment: WrapAlignment.center,
      runSpacing: Dimensions.paddingSizeLarge,
      children: List.generate(5, (index) {
        return SizedBox(
          width: MediaQuery.of(context).size.width / 3,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeExtraSmall),
            child: Shimmer(
              duration: const Duration(seconds: 2),
              enabled: isEnabled,
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                Container(
                  height: 84, width: 84,
                  decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: 0.5)),
                ),
                const SizedBox(height: Dimensions.paddingSizeSmall),
                Container(height: 16, width: 60, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(Dimensions.radiusPill))),
                const SizedBox(height: Dimensions.paddingSizeDefault),
              ]),
            ),
          ),
        );
      }),
    );
  }
}

class AddressShimmer extends StatelessWidget {
  final bool isEnabled;
  const AddressShimmer({super.key, required this.isEnabled});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: Dimensions.paddingSizeLarge),

        Padding(
          padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeSmall),
          child: TitleWidget(title: 'deliver_to'.tr),
        ),
        const SizedBox(height: Dimensions.paddingSizeExtraSmall),

        SizedBox(
          height: 70,
          child: ListView.builder(
            physics: const BouncingScrollPhysics(),
            itemCount: 5,
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeSmall),
            itemBuilder: (context, index) {
              return Container(
                width: 300,
                padding: const EdgeInsets.only(right: Dimensions.paddingSizeSmall),
                child: Container(
                  padding: EdgeInsets.all(ResponsiveHelper.isDesktop(context) ? Dimensions.paddingSizeDefault
                      : Dimensions.paddingSizeSmall),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    borderRadius: BorderRadius.circular(Dimensions.radiusSmall),
                    boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 5, spreadRadius: 1)],
                  ),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    Icon(
                      Icons.location_on,
                      size: ResponsiveHelper.isDesktop(context) ? 50 : 40, color: Theme.of(context).primaryColor,
                    ),
                    const SizedBox(width: Dimensions.paddingSizeSmall),
                    Expanded(
                      child: Shimmer(
                        duration: const Duration(seconds: 2),
                        enabled: isEnabled,
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
                          Container(height: 15, width: 100, color: Colors.grey[300]),
                          const SizedBox(height: Dimensions.paddingSizeExtraSmall),
                          Container(height: 10, width: 150, color: Colors.grey[300]),
                        ]),
                      ),
                    ),
                  ]),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
