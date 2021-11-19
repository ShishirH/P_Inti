using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Media;

namespace FirstWindow.Controls {
    public class ResizeThumb : Thumb {
        public ResizeThumb() {
            base.DragDelta += new DragDeltaEventHandler(ResizeThumb_DragDelta);
        }

        void ResizeThumb_DragDelta(object sender, DragDeltaEventArgs e) {
            IItem designerItem = this.DataContext as IItem;
            DesignerCanvas designer = VisualTreeHelper.GetParent(designerItem) as DesignerCanvas;

            if (designerItem != null && designer != null && designerItem.IsSelected) {
                double minLeft, minTop, minDeltaHorizontal, minDeltaVertical;
                double dragDeltaVertical, dragDeltaHorizontal, scale;

                IEnumerable<IItem> selectedDesignerItems = designer.SelectionService.CurrentSelection.OfType<IItem>();

                CalculateDragLimits(selectedDesignerItems, out minLeft, out minTop, out minDeltaHorizontal, out minDeltaVertical);

                foreach (IItem item in selectedDesignerItems) {
                    if (item != null && item.ParentID == Guid.Empty) {
                        switch (base.VerticalAlignment) {
                            case VerticalAlignment.Bottom:
                                dragDeltaVertical = Math.Min(-e.VerticalChange, minDeltaVertical);
                                scale = (item.ActualHeight - dragDeltaVertical) / item.ActualHeight;
                                DragBottom(scale, item, designer.SelectionService);
                                break;
                            case VerticalAlignment.Top:
                                double top = Canvas.GetTop(item);
                                dragDeltaVertical = Math.Min(Math.Max(-minTop, e.VerticalChange), minDeltaVertical);
                                scale = (item.ActualHeight - dragDeltaVertical) / item.ActualHeight;
                                DragTop(scale, item, designer.SelectionService);
                                break;
                            default:
                                break;
                        }
                        switch (base.HorizontalAlignment) {
                            case HorizontalAlignment.Left:
                                double left = Canvas.GetLeft(item);
                                dragDeltaHorizontal = Math.Min(Math.Max(-minLeft, e.HorizontalChange), minDeltaHorizontal);
                                scale = (item.ActualWidth - dragDeltaHorizontal) / item.ActualWidth;
                                DragLeft(scale, item, designer.SelectionService);
                                break;
                            case HorizontalAlignment.Right:
                                dragDeltaHorizontal = Math.Min(-e.HorizontalChange, minDeltaHorizontal);
                                scale = (item.ActualWidth - dragDeltaHorizontal) / item.ActualWidth;
                                DragRight(scale, item, designer.SelectionService);
                                break;
                            default:
                                break;
                        }
                    }
                }
                e.Handled = true;
            }
        }

        #region Helper methods

        private void DragLeft(double scale, IItem item, SelectionService selectionService) {
            IEnumerable<IItem> groupItems = selectionService.GetGroupMembers(item).Cast<IItem>();
            double groupLeft = Canvas.GetLeft(item) + item.Width;
            foreach (IItem groupItem in groupItems) {
                double groupItemLeft = Canvas.GetLeft(groupItem);
                double delta = (groupLeft - groupItemLeft) * (scale - 1);
                Canvas.SetLeft(groupItem, groupItemLeft - delta);
                groupItem.Width = groupItem.ActualWidth * scale;


                var codeNItype = new CodeNoteItem();
                if (groupItem.GetType().IsInstanceOfType(codeNItype))
                {

                   // ((CodeNoteItem)groupItem).codeNote.Width = groupItem.Width;
                }
            }
        }

        private void DragTop(double scale, IItem item, SelectionService selectionService) {
            IEnumerable<IItem> groupItems = selectionService.GetGroupMembers(item).Cast<IItem>();
            
            double groupBottom = Canvas.GetTop(item) + item.Height;
            foreach (IItem groupItem in groupItems) {
                double groupItemTop = Canvas.GetTop(groupItem);
                double delta = (groupBottom - groupItemTop) * (scale - 1);
                Canvas.SetTop(groupItem, groupItemTop - delta);
                groupItem.Height = groupItem.ActualHeight * scale;


                var codeNItype = new CodeNoteItem();

                if (groupItem.GetType().IsInstanceOfType(codeNItype))
                {

                    //((CodeNoteItem)groupItem).codeNote.Height = groupItem.Height;
                }
            }
        }

        private void DragRight(double scale, IItem item, SelectionService selectionService) {
            IEnumerable<IItem> groupItems = selectionService.GetGroupMembers(item).Cast<IItem>();
            double groupLeft = Canvas.GetLeft(item);
            foreach (IItem groupItem in groupItems) {
                double groupItemLeft = Canvas.GetLeft(groupItem);
                double delta = (groupItemLeft - groupLeft) * (scale - 1);
                Canvas.SetLeft(groupItem, groupItemLeft + delta);
                groupItem.Width = groupItem.ActualWidth * scale;

                var codeNItype = new CodeNoteItem();
                if (groupItem.GetType().IsInstanceOfType(codeNItype))
                {
                    //((CodeNoteItem)groupItem).codeNote.Width = ((CodeNoteItem)groupItem).Width;
                }
            }
        }

        private void DragBottom(double scale, IItem item, SelectionService selectionService) {
            IEnumerable<IItem> groupItems = selectionService.GetGroupMembers(item).Cast<IItem>();
            double groupTop = Canvas.GetTop(item);
            foreach (IItem groupItem in groupItems) {
                double groupItemTop = Canvas.GetTop(groupItem);
                double delta = (groupItemTop - groupTop) * (scale - 1);
                Canvas.SetTop(groupItem, groupItemTop + delta);
                groupItem.Height = groupItem.ActualHeight * scale;

                var codeNItype = new CodeNoteItem();
                if (groupItem.GetType().IsInstanceOfType(codeNItype))
                {

                    //((CodeNoteItem)groupItem).codeNote.Height = ((CodeNoteItem)groupItem).Height;
                }
            }
        }

        private void CalculateDragLimits(IEnumerable<IItem> selectedItems, out double minLeft, out double minTop, out double minDeltaHorizontal, out double minDeltaVertical) {
            minLeft = double.MaxValue;
            minTop = double.MaxValue;
            minDeltaHorizontal = double.MaxValue;
            minDeltaVertical = double.MaxValue;

            // drag limits are set by these parameters: canvas top, canvas left, minHeight, minWidth
            // calculate min value for each parameter for each item
            foreach (IItem item in selectedItems) {
                double left = Canvas.GetLeft(item);
                double top = Canvas.GetTop(item);

                minLeft = double.IsNaN(left) ? 0 : Math.Min(left, minLeft);
                minTop = double.IsNaN(top) ? 0 : Math.Min(top, minTop);

                minDeltaVertical = Math.Min(minDeltaVertical, item.ActualHeight - item.MinHeight);
                minDeltaHorizontal = Math.Min(minDeltaHorizontal, item.ActualWidth - item.MinWidth);
            }
        }

        #endregion
    }
}
