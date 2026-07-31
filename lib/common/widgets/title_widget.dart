import 'package:get/get.dart';
import 'package:sixam_mart/helper/responsive_helper.dart';
import 'package:sixam_mart/util/dimensions.dart';
import 'package:sixam_mart/util/styles.dart';
import 'package:flutter/material.dart';

class TitleWidget extends StatelessWidget {
  final String title;
  final Function? onTap;
  final String? image;
  const TitleWidget({super.key, required this.title, this.onTap, this.image});

  @override
  Widget build(BuildContext context) {

    return Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Row(children: [
        Text(title, style: robotoBold.copyWith(fontSize: ResponsiveHelper.isDesktop(context) ? Dimensions.fontSizeLarge : Dimensions.fontSizeLarge)),
        const SizedBox(width: Dimensions.paddingSizeSmall),

        image != null ? Image.asset(image!, height: 20, width: 20,) : const SizedBox(),
        ],
      ),
      (onTap != null) ? InkWell(
        onTap: onTap as void Function()?,
        borderRadius: BorderRadius.circular(Dimensions.radiusPill),
        child: Container(
          padding: const EdgeInsets.fromLTRB(Dimensions.paddingSizeSmall, 4, Dimensions.paddingSizeExtraSmall, 4),
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColor.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(Dimensions.radiusPill),
          ),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            Text(
              'see_all'.tr,
              style: robotoMedium.copyWith(fontSize: Dimensions.fontSizeSmall, color: Theme.of(context).primaryColor),
            ),
            Icon(Icons.chevron_right, size: 18, color: Theme.of(context).primaryColor),
          ]),
        ),
      ) : const SizedBox(),
    ]);
  }
}
